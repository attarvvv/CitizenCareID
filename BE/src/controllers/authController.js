import authService from '../services/authService';

const authController = {
  // POST /api/auth/register
  async register(req, res) {
    const { nama, username, email, password } = req.body;

    if (!nama || !username || !email || !password) {
      return res.status(400).json({ message: 'Semua field wajib diisi.' });
    }

    try {
      const existing = await authService.findByEmailOrUsername(email, username);
      if (existing.length > 0) {
        return res.status(409).json({ message: 'Email atau username sudah digunakan.' });
      }

      const id    = await authService.createUser({ nama, username, email, password });
      const token = authService.generateToken({ id, nama, email, role: 'user' });

      return res.status(201).json({
        message: 'Registrasi berhasil.',
        token,
        user: { id, nama, username, email, role: 'user' },
      });
    } catch (err) {
      console.error('register error:', err);
      return res.status(500).json({ message: 'Server error.' });
    }
  },

  // POST /api/auth/login
  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password wajib diisi.' });
    }

    try {
      const user = await authService.findByEmail(email);
      if (!user) return res.status(401).json({ message: 'Email atau password salah.' });

      const match = await authService.comparePassword(password, user.password);
      if (!match) return res.status(401).json({ message: 'Email atau password salah.' });

      const token = authService.generateToken({
        id: user.id, nama: user.nama, email: user.email, role: user.role,
      });

      const { password: _, ...safeUser } = user;
      return res.json({ message: 'Login berhasil.', token, user: safeUser });
    } catch (err) {
      console.error('login error:', err);
      return res.status(500).json({ message: 'Server error.' });
    }
  },

  // GET /api/auth/me
  async me(req, res) {
    try {
      const user = await authService.findById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User tidak ditemukan.' });
      return res.json({ user });
    } catch (err) {
      return res.status(500).json({ message: 'Server error.' });
    }
  },
};

export default authController;
