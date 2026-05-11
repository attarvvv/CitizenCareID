import commentService from '../services/commentService.js';
import logService     from '../services/logService.js';

const commentController = {
  // GET /api/comments/:report_id
  async getByReport(req, res) {
    try {
      const laporan = await logService.findById(req.params.report_id);
      if (!laporan) return res.status(404).json({ message: 'Laporan tidak ditemukan.' });

      if (req.user.role === 'user' && laporan.user_id !== req.user.id) {
        return res.status(403).json({ message: 'Akses ditolak.' });
      }

      const data = await commentService.getByReportId(req.params.report_id);
      return res.json({ data });
    } catch (err) {
      return res.status(500).json({ message: 'Server error.' });
    }
  },

  // POST /api/comments/:report_id
  async create(req, res) {
    const { isi } = req.body;
    if (!isi || isi.trim() === '') {
      return res.status(400).json({ message: 'Isi komentar tidak boleh kosong.' });
    }
    try {
      const laporan = await logService.findById(req.params.report_id);
      if (!laporan) return res.status(404).json({ message: 'Laporan tidak ditemukan.' });

      const data = await commentService.create({
        report_id: req.params.report_id,
        user_id:   req.user.id,
        isi:       isi.trim(),
      });
      return res.status(201).json({ message: 'Komentar ditambahkan.', data });
    } catch (err) {
      return res.status(500).json({ message: 'Server error.' });
    }
  },

  // PUT /api/comments/:id
  async update(req, res) {
    const { isi } = req.body;
    if (!isi || isi.trim() === '') {
      return res.status(400).json({ message: 'Isi komentar tidak boleh kosong.' });
    }
    try {
      const comment = await commentService.findById(req.params.id);
      if (!comment) return res.status(404).json({ message: 'Komentar tidak ditemukan.' });

      if (comment.user_id !== req.user.id) {
        return res.status(403).json({ message: 'Hanya pemilik yang bisa mengedit komentar.' });
      }

      await commentService.update(req.params.id, isi.trim());
      return res.json({ message: 'Komentar diupdate.' });
    } catch (err) {
      return res.status(500).json({ message: 'Server error.' });
    }
  },

  // DELETE /api/comments/:id
  async delete(req, res) {
    try {
      const comment = await commentService.findById(req.params.id);
      if (!comment) return res.status(404).json({ message: 'Komentar tidak ditemukan.' });

      const isOwner = comment.user_id === req.user.id;
      const isAdmin = ['admin', 'super_admin'].includes(req.user.role);

      if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: 'Akses ditolak.' });
      }

      await commentService.delete(req.params.id);
      return res.json({ message: 'Komentar dihapus.' });
    } catch (err) {
      return res.status(500).json({ message: 'Server error.' });
    }
  },
};

export default commentController;
