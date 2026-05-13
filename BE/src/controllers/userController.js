import userService from '../services/userService.js';

const userController = {
  // GET /api/users
  async getAll(req, res) {
    const { role, page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    try {
      const { rows, total } = await userService.getAll({ role, limit: parseInt(limit), offset });
      return res.json({
        data: rows,
        pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / limit) },
      });
    } catch (err) {
      console.error('getAll users:', err);
      return res.status(500).json({ message: 'Server error.' });
    }
  },

  // GET /api/users/:id
  async getById(req, res) {
    try {
      const user = await userService.findById(req.params.id);
      if (!user) return res.status(404).json({ message: 'User tidak ditemukan.' });
      return res.json({ data: user });
    } catch (err) {
      return res.status(500).json({ message: 'Server error.' });
    }
  },

  // POST /api/users
  async create(req, res) {
    const { nama, username, email, password, role = 'user' } = req.body;
    if (!nama || !username || !email || !password) {
      return res.status(400).json({ message: 'nama, username, email, password wajib diisi.' });
    }
    const allowedRoles = ['user', 'admin', 'super_admin'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Role tidak valid.' });
    }

    try {
      const dup = await userService.findDuplicate(email, username);
      if (dup) return res.status(409).json({ message: 'Email atau username sudah digunakan.' });

      const id = await userService.create({ nama, username, email, password, role });
      return res.status(201).json({ message: 'User dibuat.', data: { id, nama, username, email, role } });
    } catch (err) {
      console.error('create user:', err);
      return res.status(500).json({ message: 'Server error.' });
    }
  },

  // PUT /api/users/:id
  async update(req, res) {
    const { nama, username, email, password, role } = req.body;
    try {
      const current = await userService.findById(req.params.id);
      if (!current) return res.status(404).json({ message: 'User tidak ditemukan.' });

      if (email || username) {
        const dup = await userService.findDuplicate(
          email || current.email,
          username || current.username,
          req.params.id
        );
        if (dup) return res.status(409).json({ message: 'Email atau username sudah digunakan.' });
      }

      await userService.update(req.params.id, { nama, username, email, password, role }, current);
      return res.json({ message: 'User diupdate.' });
    } catch (err) {
      console.error('update user:', err);
      return res.status(500).json({ message: 'Server error.' });
    }
  },

  // DELETE /api/users/:id
  async delete(req, res) {
    if (parseInt(req.params.id) === req.user.id) {
      return res.status(400).json({ message: 'Tidak bisa menghapus akun sendiri.' });
    }
    try {
      const user = await userService.findById(req.params.id);
      if (!user) return res.status(404).json({ message: 'User tidak ditemukan.' });

      await userService.delete(req.params.id);
      return res.json({ message: 'User dihapus.' });
    } catch (err) {
      return res.status(500).json({ message: 'Server error.' });
    }
  },
};

export default userController;
