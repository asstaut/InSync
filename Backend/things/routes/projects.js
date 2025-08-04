const express = require('express');
const db = require('../db');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter });

function generateJoinCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

console.log('📁 Project routes loaded');

// ================= CREATE PROJECT =================
router.post('/', upload.single('proposal'), (req, res) => {
  const {
    projectTitle,
    projectDescription,
    Semester,
    projectRepository,
    userID
  } = req.body;

  const joinCode = generateJoinCode();
  const proposalBlob = req.file?.buffer;

  const stmt = db.prepare(`
    INSERT INTO PROJECT (
      projectTitle, projectDescription, Semester, projectRepository, status, proposal, joinCode
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    projectTitle,
    projectDescription,
    Semester,
    projectRepository,
    "Pending",
    proposalBlob,
    joinCode
  );

  const projectID = result.lastInsertRowid;

  db.prepare('INSERT INTO UserProject (userID, projectID) VALUES (?, ?)').run(userID, projectID);

  res.json({ projectID, joinCode });
});

// ================= GET PROJECTS =================

router.get('/allplease', (req, res) => {
  const rows = db.prepare('SELECT * FROM PROJECT').all();
  res.json(rows);
});

router.get('/', authenticateToken, (req, res) => {
  const userID = req.user.userID;

  try {
    const stmt = db.prepare(`
      SELECT p.*
      FROM PROJECT p
      JOIN UserProject up ON p.projectID = up.projectID
      WHERE up.userID = ? AND p.status != 'Complete'
    `);
    const projects = stmt.all(userID);
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

router.get('/completed', authenticateToken, (req, res) => {
  const userID = req.user.userID;

  try {
    const stmt = db.prepare(`
      SELECT p.*
      FROM PROJECT p
      JOIN UserProject up ON p.projectID = up.projectID
      WHERE up.userID = ? AND p.status = 'Complete'
    `);
    const projects = stmt.all(userID);
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch completed projects' });
  }
});

router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM PROJECT WHERE projectID = ?').get(req.params.id);
  console.log(row);
  res.json(row);
});

// ================= UPDATE PROJECT =================

router.put('/:id', (req, res) => {
  const { status } = req.body;

  db.prepare(`
    UPDATE PROJECT
    SET status = ?
    WHERE projectID = ?
  `).run(status, req.params.id);

  res.sendStatus(200);
});

// ================= DELETE PROJECT (ARCHIVED ONLY) =================

router.delete('/:id', authenticateToken, (req, res) => {
  const userID = req.user.userID;
  const projectID = req.params.id;

  try {
    // Ensure project is archived
    const project = db.prepare('SELECT status FROM PROJECT WHERE projectID = ?').get(projectID);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // if (project.status !== 'Complete') {
    //   return res.status(403).json({ error: 'Only archived (completed) projects can be deleted.' });
    // }

    // Confirm user is part of the project
    const isMember = db.prepare('SELECT * FROM UserProject WHERE userID = ? AND projectID = ?').get(userID, projectID);

    if (!isMember) {
      return res.status(403).json({ error: 'You are not authorized to delete this project.' });
    }

    // Delete related records
    db.prepare('DELETE FROM TASK WHERE projectID = ?').run(projectID);
    db.prepare('DELETE FROM COMMENT WHERE projectID = ?').run(projectID);
    db.prepare('DELETE FROM UserProject WHERE projectID = ?').run(projectID);
    db.prepare('DELETE FROM PROJECT WHERE projectID = ?').run(projectID);

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

module.exports = router;

