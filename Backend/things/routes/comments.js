const express = require('express');
const db = require('../db');
const router = express.Router();
const authenticateToken = require('../middleware/auth'); // Middleware to verify JWT and attach user to req

// ✅ Create comment (students and supervisors)
router.post('/', authenticateToken, (req, res) => {
  const { projectID, commentText } = req.body;
  const userID = req.user.userID;

  if (!commentText || !projectID) {
    return res.status(400).json({ message: "Missing comment text or project ID" });
  }

  const stmt = db.prepare('INSERT INTO COMMENT (userID, projectID, commentText) VALUES (?, ?, ?)');
  const result = stmt.run(userID, projectID, commentText);

  res.status(201).json({ id: result.lastInsertRowid });
});

// ✅ Get all comments
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM COMMENT').all();
  res.json(rows);
});

// ✅ Get comments by project with username and role
router.get('/project/:projectID', (req, res) => {
  const rows = db.prepare(`
    SELECT c.commentID, u.username, c.createdAt, c.commentText, u.role 
    FROM COMMENT c 
    JOIN USERS u ON c.userID = u.userID 
    WHERE c.projectID = ?
  `).all(req.params.projectID);
  res.json(rows);
});

// ✅ Update comment (optional feature - not role restricted)
router.put('/:id', (req, res) => {
  const { commentText } = req.body;
  if (!commentText) {
    return res.status(400).json({ message: "Missing comment text" });
  }
  db.prepare('UPDATE COMMENT SET commentText = ? WHERE commentID = ?').run(commentText, req.params.id);
  res.sendStatus(200);
});

// ✅ Delete comment (only supervisors can delete)
router.delete('/:id', authenticateToken, (req, res) => {
  const userRole = req.user.role;

  if (userRole.toLowerCase() !== 'supervisor') {
    return res.status(403).json({ message: 'Only supervisors can delete comments' });
  }

  db.prepare('DELETE FROM COMMENT WHERE commentID = ?').run(req.params.id);
  res.sendStatus(200);
});

module.exports = router;

