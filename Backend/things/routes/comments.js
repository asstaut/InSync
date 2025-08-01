const express = require('express');
const db = require('../db');
const router = express.Router();

// Create comment
router.post('/', (req, res) => {
  const { userID, projectID, commentText } = req.body;
  const stmt = db.prepare('INSERT INTO COMMENT (userID, projectID, commentText) VALUES (?, ?, ?)');
  const result = stmt.run(userID, projectID, commentText);
  res.json({ id: result.lastInsertRowid });
});

// Get all comments
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM COMMENT').all();
  res.json(rows);
});

// Get comments by project
router.get('/project/:projectID', (req, res) => {
  //const rows = db.prepare('SELECT * FROM COMMENT WHERE projectID = ?').all(req.params.projectID);

  const rows =db.prepare(`
  select u.username, c.userid ,c.createdAt from  COMMENT c join  USERS u on c.userID = u.userid where c.projectId = ? 
  `).all(req.params.projectID);
  res.json(rows);
});

// Update comment
router.put('/:id', (req, res) => {
  const { commentText } = req.body;
  db.prepare('UPDATE COMMENT SET commentText = ? WHERE commentID = ?').run(commentText, req.params.id);
  res.sendStatus(200);
});

// Delete comment
router.delete('/:id', (req, res) => {


  
  db.prepare('DELETE FROM COMMENT WHERE commentID = ?').run(req.params.id);
  res.sendStatus(200);
});

module.exports = router;


