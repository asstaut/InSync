const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const router = express.Router();

router.post('/', async (req, res) => {

  console.log("help");
  const { username, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const stmt = db.prepare(`
      INSERT INTO USERS (username, email, password, role)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(username, email, hashedPassword, role);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Email already in use or invalid data' });
  }
});

module.exports = router;
