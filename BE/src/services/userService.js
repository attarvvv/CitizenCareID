import db     from '../config/db.js';
import bcrypt from 'bcrypt';

const userService = {
  async getAll({ role, limit, offset }) {
    let where  = '';
    let params = [];
    if (role) { where = 'WHERE role = ?'; params.push(role); }

    const [rows] = await db.query(
      `SELECT id, nama, username, email, role, created_at
       FROM users ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) AS total FROM users ${where}`, params
    );
    return { rows, total };
  },

  async findById(id) {
    const [rows] = await db.query(
      'SELECT id, nama, username, email, role, created_at FROM users WHERE id = ?', [id]
    );
    return rows[0] || null;
  },

  async findDuplicate(email, username, excludeId = null) {
    const query  = excludeId
      ? 'SELECT id FROM users WHERE (email = ? OR username = ?) AND id != ?'
      : 'SELECT id FROM users WHERE email = ? OR username = ?';
    const params = excludeId ? [email, username, excludeId] : [email, username];
    const [rows] = await db.query(query, params);
    return rows.length > 0;
  },

  async create({ nama, username, email, password, role }) {
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (nama, username, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [nama, username, email, hashed, role]
    );
    return result.insertId;
  },

  async update(id, { nama, username, email, password, role }, current) {
    let newPassword = current.password;
    if (password) newPassword = await bcrypt.hash(password, 10);

    await db.query(
      'UPDATE users SET nama=?, username=?, email=?, password=?, role=? WHERE id=?',
      [
        nama     || current.nama,
        username || current.username,
        email    || current.email,
        newPassword,
        role     || current.role,
        id,
      ]
    );
  },

  async delete(id) {
    await db.query('DELETE FROM users WHERE id = ?', [id]);
  },
};

export default userService;