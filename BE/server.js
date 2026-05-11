import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import reportRoutes from './routes/report.js';
import categoryRoutes from './routes/category.js';
import commentRoutes from './routes/comment.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/comment', commentRoutes);

app.get('/', (req, res) => {
  res.send('API jalan 🚀');
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server jalan 🚀');
});