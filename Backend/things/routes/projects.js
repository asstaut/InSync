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

  if(!proposalBlob)
  {console.log("helpo");}

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
      WHERE up.userID = ? and p.status != 'Complete'
    `);
    const projects = stmt.all(userID);
    console.log(projects);

    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});




// Get one project

console.log("1");
//COMEPLTED PROJECTS
router.get('/completed', authenticateToken, (req, res) => {
console.log("2");
  const userID = req.user.userID;

  try {
    const stmt = db.prepare(`
      SELECT p.*
      FROM PROJECT p
      JOIN UserProject up ON p.projectID = up.projectID
      WHERE up.userID = ? AND p.status='Complete'
    `);
    const projects = stmt.all(userID);

    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM PROJECT WHERE projectID = ?').get(req.params.id);
  res.json(row);
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
