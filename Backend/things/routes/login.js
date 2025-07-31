const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

// Secret key for JWT
const JWT_SECRET = 'your-secret-key'; // Use a strong secret & store in .env

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    const stmt = db.prepare('SELECT * FROM USERS WHERE email = ?');
    const user = stmt.get(email);

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userID: user.userid, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user: { username: user.username, role: user.role } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
