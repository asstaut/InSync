const express = require('express');
const db = require('../db');
const router = express.Router();
const authenticateToken = require('../middleware/auth');

function generateJoinCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}


console.log('📁 Project routes loaded');

router.post('/', (req, res) => {
  const {
    projectTitle,
    projectDescription,
    Semester,
    projectRepository,
    status,
    proposal,
    userID
  } = req.body;
  console.log('hit');
  const joinCode = generateJoinCode();

  const stmt = db.prepare(`
    INSERT INTO PROJECT (
      projectTitle, projectDescription, Semester, projectRepository, status, proposal, joinCode
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(projectTitle, projectDescription, Semester, projectRepository, status, proposal, joinCode);
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

// Update project
router.put('/:id', (req, res) => {
  const { projectTitle, projectDescription, Semester, projectRepository, status, proposal } = req.body;
  db.prepare(`
    UPDATE PROJECT SET
      projectTitle = ?, projectDescription = ?, Semester = ?, projectRepository = ?, status = ?, proposal = ?
    WHERE projectID = ?
  `).run(projectTitle, projectDescription, Semester, projectRepository, status, proposal, req.params.id);
  res.sendStatus(200);
});

// Delete project
router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM PROJECT WHERE projectID = ?').run(req.params.id);
  res.sendStatus(200);
});

module.exports = router;
