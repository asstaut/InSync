const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

// Secret key for JWT
const secret = process.env.JWT_SECRET;



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
    console.log(user);

    const token = jwt.sign(
      { userID: user.userid, email: user.email, username:user.username, role: user.Role },
      secret,
      { expiresIn: '1h' }
    );

    res.json({ token, user: {userID: user.userid, username: user.username, role: user.Role } , message:"Login successful"});
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
