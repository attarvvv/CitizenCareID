import db from '../config/db.js';

const categoryService = {
  async getAll() {
    const [rows] = await db.query('SELECT * FROM categories ORDER BY id ASC');
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create(nama) {
    const [result] = await db.query('INSERT INTO categories (nama) VALUES (?)', [nama]);
    return { id: result.insertId, nama };
  },

  async update(id, nama) {
    await db.query('UPDATE categories SET nama=? WHERE id=?', [nama, id]);
  },

  async delete(id) {
    await db.query('DELETE FROM categories WHERE id=?', [id]);
  },
};

export default categoryService;