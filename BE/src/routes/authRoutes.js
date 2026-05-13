import express from 'express';
import db from '../config/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);

    const sql = `INSERT INTO users (username, password) VALUES (?, ?)`;

    db.query(sql, [username, hashed], (err) => {
      if (err) return res.status(500).json(err);

      res.json({ message: 'Register berhasil' });
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// LOGIN
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query(
    `SELECT * FROM users WHERE username = ?`,
    [username],
    async (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length === 0) {
        return res.status(401).json({ message: 'User tidak ditemukan' });
      }

      const user = result[0];

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.status(401).json({ message: 'Password salah' });
      }

      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.json({
        message: 'Login berhasil',
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      });
    }
  );
});

export default router;