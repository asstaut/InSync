const express = require('express');
const db = require('../db');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/auth');

// Link user to project
router.post('/', (req, res) => {
  const { userID, projectID } = req.body;
  const stmt = db.prepare('INSERT INTO UserProject (userID, projectID) VALUES (?, ?)');
  stmt.run(userID, projectID);
  res.sendStatus(200);
});

// Get users in a project
router.get('/project/:projectID', (req, res) => {
  console.log('hit');
  const rows = db.prepare(`
    SELECT u.userid, u.username, u.role, up.activityScore FROM USERS u
    JOIN UserProject up ON u.userid = up.userID
    WHERE up.projectID = ?
  `).all(req.params.projectID);
  res.json(rows);
});

// Get projects of a user
router.get('/user/:userID', (req, res) => {
  const rows = db.prepare(`
    SELECT p.projectID, p.projectTitle FROM PROJECT p
    JOIN UserProject up ON p.projectID = up.projectID
    WHERE up.userID = ?
  `).all(req.params.userID);
  res.json(rows);
});

// Remove user from project
router.delete('/', (req, res) => {
  const { userID, projectID } = req.body;
  db.prepare('DELETE FROM UserProject WHERE userID = ? AND projectID = ?')
    .run(userID, projectID);
  res.sendStatus(200);
});

router.post('/join', authenticateToken, (req, res) => {
  const { joinCode } = req.body;
  const userID = req.user.userID;

  try {
    // Find projectID by joinCode
    const project = db.prepare('SELECT projectID FROM PROJECT WHERE joinCode = ?').get(joinCode);
    if (!project) return res.status(404).json({ error: 'Invalid join code' });

    // Insert into UserProject
    const stmt = db.prepare('INSERT OR IGNORE INTO UserProject (userID, projectID) VALUES (?, ?)');
    stmt.run(userID, project.projectID);

    res.json({ message: 'Joined project successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal error' });
  }
});



module.exports = router;
