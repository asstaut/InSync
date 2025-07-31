const express = require('express');
const db = require('../db');
const router = express.Router();

// Create user
router.post('/', (req, res) => {
  const { username, role, email, password } = req.body;
  const stmt = db.prepare('INSERT INTO USERS (username, role, email, password) VALUES (?, ?, ?, ?)');
  const result = stmt.run(username, role, email, password);
  res.json({ id: result.lastInsertRowid });
});

// Get all users
router.get('/', (req, res) => {
  const users = db.prepare('SELECT * FROM USERS').all();
  res.json(users);
});

// Get user by ID
router.get('/:id', (req, res) => {
  const user = db.prepare('SELECT * FROM USERS WHERE userid = ?').get(req.params.id);
  res.json(user);
});

// Update user
router.put('/:id', (req, res) => {
  const { username, role, email, password } = req.body;
  db.prepare('UPDATE USERS SET username = ?, role = ?, email = ?, password = ? WHERE userid = ?')
    .run(username, role, email, password, req.params.id);
  res.sendStatus(200);
});

// Delete user
router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM USERS WHERE userid = ?').run(req.params.id);
  res.sendStatus(200);
});

module.exports = router;
