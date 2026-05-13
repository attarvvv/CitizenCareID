import express from 'express';
import db from '../config/db.js';
import verifyToken from '../middlewares/authMiddleware.js';

const router = express.Router();

// ADD COMMENT
router.post('/', verifyToken, (req, res) => {
  const { body, public_report_id } = req.body;
  const user_id = req.user.id;

  const sql = `
    INSERT INTO comments (body, user_id, public_report_id)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [body, user_id, public_report_id], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: 'Komentar ditambahkan' });
  });
});

// GET COMMENT BY REPORT
router.get('/:reportId', (req, res) => {
  const sql = `
    SELECT c.*, u.username
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.public_report_id = ?
    ORDER BY c.created_at DESC
  `;

  db.query(sql, [req.params.reportId], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
});

export default router;