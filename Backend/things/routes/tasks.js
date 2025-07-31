const express = require('express');
const db = require('../db');
const router = express.Router();

// Create task
router.post('/', (req, res) => {
  const { taskText, projectID, userID } = req.body;
  const stmt = db.prepare('INSERT INTO TASK (taskText, projectID, userID) VALUES (?, ?, ?)');
  const result = stmt.run(taskText, projectID, userID);
  res.json({ id: result.lastInsertRowid });
});

// Get all tasks
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM TASK').all();
  res.json(rows);
});

// Get tasks by project
router.get('/project/:projectID', (req, res) => {
  const rows = db.prepare('SELECT * FROM TASK WHERE projectID = ?').all(req.params.projectID);
  res.json(rows);
});

// Update task
router.put('/:id', (req, res) => {
  const { taskText, userID } = req.body;
  db.prepare('UPDATE TASK SET taskText = ?, userID = ? WHERE taskID = ?')
    .run(taskText, userID, req.params.id);
  res.sendStatus(200);
});

// Delete task
router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM TASK WHERE taskID = ?').run(req.params.id);
  res.sendStatus(200);
});

module.exports = router;
