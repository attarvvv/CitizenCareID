import db from '../config/db.js';

const logService = {
  async getAll({ userId, role, status, category_id, limit, offset }) {
    const conditions = [];
    const params     = [];

    if (role === 'user') { conditions.push('r.user_id = ?');     params.push(userId); }
    if (status)          { conditions.push('r.status = ?');       params.push(status); }
    if (category_id)     { conditions.push('r.category_id = ?'); params.push(category_id); }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

    const [rows] = await db.query(
      `SELECT r.id, r.judul, r.deskripsi, r.lokasi, r.gambar, r.status,
              r.created_at, r.updated_at,
              u.id AS user_id, u.nama AS nama_user,
              c.id AS category_id, c.nama AS kategori
       FROM reports r
       JOIN users u      ON r.user_id     = u.id
       JOIN categories c ON r.category_id = c.id
       ${where}
       ORDER BY r.created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) AS total FROM reports r ${where}`, params
    );

    return { rows, total };
  },

  async findById(id) {
    const [rows] = await db.query(
      `SELECT r.id, r.judul, r.deskripsi, r.lokasi, r.gambar, r.status,
              r.created_at, r.updated_at,
              u.id AS user_id, u.nama AS nama_user,
              c.id AS category_id, c.nama AS kategori
       FROM reports r
       JOIN users u      ON r.user_id     = u.id
       JOIN categories c ON r.category_id = c.id
       WHERE r.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async create({ user_id, category_id, judul, deskripsi, lokasi, gambar }) {
    const [result] = await db.query(
      'INSERT INTO reports (user_id, category_id, judul, deskripsi, lokasi, gambar) VALUES (?,?,?,?,?,?)',
      [user_id, category_id, judul, deskripsi, lokasi, gambar]
    );
    return result.insertId;
  },

  async update(id, { judul, deskripsi, lokasi, category_id, gambar }, current) {
    await db.query(
      'UPDATE reports SET judul=?, deskripsi=?, lokasi=?, category_id=?, gambar=? WHERE id=?',
      [
        judul       || current.judul,
        deskripsi   || current.deskripsi,
        lokasi      || current.lokasi,
        category_id || current.category_id,
        gambar      !== undefined ? gambar : current.gambar,
        id,
      ]
    );
  },

  async updateStatus(id, status) {
    await db.query('UPDATE reports SET status=? WHERE id=?', [status, id]);
  },

  async delete(id) {
    await db.query('DELETE FROM reports WHERE id=?', [id]);
  },
};

export default logService;