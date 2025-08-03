const express = require('express');
const db = require('../db');
const router = express.Router();

// Create task
router.post('/', (req, res) => {
  const { taskText, projectID, userID } = req.body;
   if (!taskText || !userID || !projectID) {
    return res.status(400).json({ error: "Missing required fields" });
  }

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
  console.log("hit");

  
  const rows =db.prepare(`
  select t.taskID, u.username, t.createdAt, t.taskText from  TASK t join  USERS u on t.userID = u.userid where t.projectId = ? 
  `).all(req.params.projectID);
  //const rows = db.prepare('SELECT * FROM TASK WHERE projectID = ?').all(req.params.projectID);
  //console.log(res);
  res.json(rows);
});

// Update task shouldnt be used hai 
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
