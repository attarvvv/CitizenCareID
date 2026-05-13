import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";
import commentRoutes from "./src/routes/commentRoutes.js";
import logRoutes from "./src/routes/logRoutes.js";
import reportRoutes from "./src/routes/reportRoutes.js";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/reports", reportRoutes);

app.get('/', (req, res) => {
  res.send('API jalan');
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server jalan');
});