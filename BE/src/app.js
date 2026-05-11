import express from 'express';
import cors    from 'cors';
import path    from 'path';

const app = express();

// ── Middleware global ────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static: akses gambar via /uploads/namafile.jpg
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ── Routes ───────────────────────────────────────────────────
app.use('/api/auth',       require('./routes/authRoutes'));
app.use('/api/reports',    require('./routes/logRoutes'));
app.use('/api/comments',   require('./routes/commentRoutes'));
app.use('/api/users',      require('./routes/userRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));

// Health check
app.get('/', (req, res) => res.json({ status: 'aktif', version: '1.0.0' }));

// ── Error handler global ─────────────────────────────────────
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File terlalu besar. Maksimal 5MB.' });
  }
  if (err.message?.includes('Hanya file')) {
    return res.status(400).json({ message: err.message });
  }
  console.error('Unhandled error:', err.message);
  res.status(500).json({ message: 'Internal server error.' });
});

export default app;
