import db     from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt    from 'jsonwebtoken';

const authService = {
  async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  },

  async findByEmailOrUsername(email, username) {
    const [rows] = await db.query(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );
    return rows;
  },

  async createUser({ nama, username, email, password, role = 'user' }) {
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (nama, username, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [nama, username, email, hashed, role]
    );
    return result.insertId;
  },

  async findById(id) {
    const [rows] = await db.query(
      'SELECT id, nama, username, email, role, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  comparePassword(plain, hashed) {
    return bcrypt.compare(plain, hashed);
  },

  generateToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
  },
};

export default authService;