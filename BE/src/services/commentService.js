import db from '../config/db.js';

const commentService = {
  async getByReportId(reportId) {
    const [rows] = await db.query(
      `SELECT c.id, c.isi, c.created_at,
              u.id AS user_id, u.nama AS nama_user, u.role AS role_user
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.report_id = ?
       ORDER BY c.created_at ASC`,
      [reportId]
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query('SELECT * FROM comments WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create({ report_id, user_id, isi }) {
    const [result] = await db.query(
      'INSERT INTO comments (report_id, user_id, isi) VALUES (?, ?, ?)',
      [report_id, user_id, isi]
    );
    const [rows] = await db.query(
      `SELECT c.id, c.isi, c.created_at,
              u.id AS user_id, u.nama AS nama_user, u.role AS role_user
       FROM comments c JOIN users u ON c.user_id = u.id
       WHERE c.id = ?`,
      [result.insertId]
    );
    return rows[0];
  },

  async update(id, isi) {
    await db.query('UPDATE comments SET isi=? WHERE id=?', [isi, id]);
  },

  async delete(id) {
    await db.query('DELETE FROM comments WHERE id=?', [id]);
  },
};

export default commentService;