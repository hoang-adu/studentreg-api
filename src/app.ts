// ============================================================
// src/app.ts — Entry Point
// ============================================================
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { testConnection } from './db/db';
import { errorHandler } from './middleware/errorHandler';
import studentRoutes    from './routes/students';
import enrollmentRoutes from './routes/enrollments';

dotenv.config();

const app  = express();
const PORT = Number(process.env.PORT) || 3000;

// ── Middleware ────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ───────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    message : '🎓 StudentReg API đang chạy!',
    version : '1.0.0',
    endpoints: {
      students    : 'GET | POST | PUT | DELETE  /api/students',
      enrollments : 'GET | POST | DELETE        /api/enrollments',
    },
  });
});

app.use('/api/students',    studentRoutes);
app.use('/api/enrollments', enrollmentRoutes);

// 404
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route không tồn tại.' });
});

// Xử lý lỗi tập trung (phải đặt cuối cùng)
app.use(errorHandler);

// ── Khởi động ────────────────────────────────────────────────
async function start(): Promise<void> {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`🚀 Server: http://localhost:${PORT}`);
  });
}

start().catch((err: Error) => {
  console.error('❌ Không thể khởi động:', err.message);
  process.exit(1);
});
