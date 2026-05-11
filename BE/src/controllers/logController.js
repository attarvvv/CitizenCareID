import path from 'path';
import fs from 'fs';
import logService from '../services/logService';

const logController = {
  // GET /api/reports
  async getAll(req, res) {
    const { status, category_id, page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    try {
      const { rows, total } = await logService.getAll({
        userId: req.user.id,
        role: req.user.role,
        status,
        category_id,
        limit: parseInt(limit),
        offset,
      });
      return res.json({
        data: rows,
        pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / limit) },
      });
    } catch (err) {
      console.error('getAll reports:', err);
      return res.status(500).json({ message: 'Server error.' });
    }
  },

  // GET /api/reports/:id
  async getById(req, res) {
    try {
      const laporan = await logService.findById(req.params.id);
      if (!laporan) return res.status(404).json({ message: 'Laporan tidak ditemukan.' });

      // User biasa hanya bisa lihat laporan sendiri
      if (req.user.role === 'user' && laporan.user_id !== req.user.id) {
        return res.status(403).json({ message: 'Akses ditolak.' });
      }
      return res.json({ data: laporan });
    } catch (err) {
      return res.status(500).json({ message: 'Server error.' });
    }
  },

  // POST /api/reports
  async create(req, res) {
    const { judul, deskripsi, lokasi, category_id } = req.body;
    if (!judul || !deskripsi || !lokasi || !category_id) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'judul, deskripsi, lokasi, category_id wajib diisi.' });
    }

    const gambar = req.file ? `/uploads/${req.file.filename}` : null;
    try {
      const id = await logService.create({
        user_id: req.user.id, category_id, judul, deskripsi, lokasi, gambar,
      });
      const data = await logService.findById(id);
      return res.status(201).json({ message: 'Laporan dibuat.', data });
    } catch (err) {
      if (req.file) fs.unlinkSync(req.file.path);
      console.error('create report:', err);
      return res.status(500).json({ message: 'Server error.' });
    }
  },

  // PUT /api/reports/:id
  async update(req, res) {
    const { judul, deskripsi, lokasi, category_id } = req.body;
    try {
      const laporan = await logService.findById(req.params.id);
      if (!laporan) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(404).json({ message: 'Laporan tidak ditemukan.' });
      }

      const isOwner = laporan.user_id === req.user.id;
      const isAdmin = ['admin', 'super_admin'].includes(req.user.role);

      if (!isAdmin && !(isOwner && laporan.status === 'pending')) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(403).json({ message: 'Tidak bisa mengedit laporan ini.' });
      }

      // Ganti gambar lama jika ada upload baru
      let gambar = undefined;
      if (req.file) {
        if (laporan.gambar) {
          const oldPath = path.join(__dirname, '..', '..', laporan.gambar);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        gambar = `/uploads/${req.file.filename}`;
      }

      await logService.update(req.params.id, { judul, deskripsi, lokasi, category_id, gambar }, laporan);
      const updated = await logService.findById(req.params.id);
      return res.json({ message: 'Laporan diupdate.', data: updated });
    } catch (err) {
      if (req.file) fs.unlinkSync(req.file.path);
      console.error('update report:', err);
      return res.status(500).json({ message: 'Server error.' });
    }
  },

  // PATCH /api/reports/:id/status  (admin/super_admin)
  async updateStatus(req, res) {
    const { status } = req.body;
    const allowed = ['pending', 'approved', 'rejected'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Status tidak valid. (pending/approved/rejected)' });
    }
    try {
      const laporan = await logService.findById(req.params.id);
      if (!laporan) return res.status(404).json({ message: 'Laporan tidak ditemukan.' });

      await logService.updateStatus(req.params.id, status);
      return res.json({ message: `Status diubah menjadi "${status}".` });
    } catch (err) {
      return res.status(500).json({ message: 'Server error.' });
    }
  },

  // DELETE /api/reports/:id
  async delete(req, res) {
    try {
      const laporan = await logService.findById(req.params.id);
      if (!laporan) return res.status(404).json({ message: 'Laporan tidak ditemukan.' });

      const isOwner = laporan.user_id === req.user.id;
      const isAdmin = ['admin', 'super_admin'].includes(req.user.role);

      if (!isAdmin && !(isOwner && laporan.status === 'pending')) {
        return res.status(403).json({ message: 'Tidak bisa menghapus laporan ini.' });
      }

      // Hapus file gambar
      if (laporan.gambar) {
        const imgPath = path.join(__dirname, '..', '..', laporan.gambar);
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      }

      await logService.delete(req.params.id);
      return res.json({ message: 'Laporan dihapus.' });
    } catch (err) {
      console.error('delete report:', err);
      return res.status(500).json({ message: 'Server error.' });
    }
  },
};

export default logController;
