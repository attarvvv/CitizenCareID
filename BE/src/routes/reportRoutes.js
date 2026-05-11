import express from 'express';
import db from '../db.js';
import verifyToken from '../middlewares/authMiddleware.js';

const router = express.Router();

// CREATE REPORT
router.post('/', verifyToken, (req, res) => {
  const { header, body, category_id } = req.body;
  const user_id = req.user.id;

  const sql = `
    INSERT INTO public_reports 
    (header, body, user_id, category_id, status)
    VALUES (?, ?, ?, ?, 'PENDING')
  `;

  db.query(sql, [header, body, user_id, category_id], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: 'Report dibuat' });
  });
});

// GET ALL REPORT
router.get('/', (req, res) => {
  const sql = `
    SELECT pr.*, u.username, c.category_name
    FROM public_reports pr
    JOIN users u ON pr.user_id = u.id
    LEFT JOIN categories c ON pr.category_id = c.id
    ORDER BY pr.created_at DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// UPDATE STATUS (ADMIN ONLY)
router.put('/:id', verifyToken, (req, res) => {
  const { status } = req.body;

  if (!['admin', 'superadmin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Akses ditolak' });
  }

  db.query(
    `UPDATE public_reports SET status = ? WHERE id = ?`,
    [status, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({ message: 'Status diupdate' });
    }
  );
});

export default router;