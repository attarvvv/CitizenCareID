import express from 'express';
import db from '../config/db.js';
import verifyToken from '../middlewares/authMiddleware.js';

const router = express.Router();

// CREATE CATEGORY (ADMIN ONLY)
router.post('/', verifyToken, (req, res) => {
  if (!['admin', 'superadmin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Akses ditolak' });
  }

  const { category_name } = req.body;

  db.query(
    `INSERT INTO categories (category_name) VALUES (?)`,
    [category_name],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({ message: 'Kategori dibuat' });
    }
  );
});

// GET ALL CATEGORY
router.get('/', (req, res) => {
  db.query(`SELECT * FROM categories`, (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
});

export default router;