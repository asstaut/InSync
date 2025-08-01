const express = require('express');
const db = require('../db');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

function generateJoinCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}


console.log('📁 Project routes loaded');

router.post('/', upload.single('proposal'),(req, res) => {
  const {
    projectTitle,
    projectDescription,
    Semester,
    projectRepository,
    status,
    userID
  } = req.body;
  console.log('hit');
  const joinCode = generateJoinCode();
  const proposalBlob = req.file?.buffer;

  const stmt = db.prepare(`
    INSERT INTO PROJECT (
      projectTitle, projectDescription, Semester, projectRepository, status, proposal, joinCode
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(projectTitle, projectDescription, Semester, projectRepository, "Pending", proposalBlob, joinCode);
  const projectID = result.lastInsertRowid;

  db.prepare('INSERT INTO UserProject (userID, projectID) VALUES (?, ?)').run(userID, projectID);

  res.json({ projectID, joinCode });
});

router.get('/:projectID/proposal', (req, res) => {
  const projectID = req.params.projectID;
  
  const row = db.prepare('SELECT proposal FROM PROJECT WHERE projectID = ?').get(projectID);
  
  if (!row || !row.proposal) {
    return res.status(404).json({ error: 'PDF not found' });
  }
  
  // Set content headers for PDF
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline; filename="proposal.pdf"');
  
  // Send the raw PDF buffer
  res.send(row.proposal);
});




// Get all projects
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
      WHERE up.userID = ?
    `);
    const projects = stmt.all(userID);

    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});




// Get one project
router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM PROJECT WHERE projectID = ?').get(req.params.id);
  res.json(row);
});


//COMEPLTED PROJECTS
router.get('/completed', authenticateToken, (req, res) => {
  const userID = req.user.userID;

  try {
    const stmt = db.prepare(`
      SELECT p.*
      FROM PROJECT p
      JOIN UserProject up ON p.projectID = up.projectID 
      WHERE up.userID = ? AND status="completed"
    `);
    const projects = stmt.all(userID);

    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});




// Update project verify the sender is a teacher in the frontend
router.put('/:id', (req, res) => {
  const { status} = req.body;
  db.prepare(`
    UPDATE PROJECT SET
     status = ?
    WHERE projectID = ?
  `).run(status, req.params.id);
  res.sendStatus(200);
});

// Delete project
router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM PROJECT WHERE projectID = ?').run(req.params.id);
  res.sendStatus(200);
});

module.exports = router;
