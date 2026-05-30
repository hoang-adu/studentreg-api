// ============================================================
// src/middleware/errorHandler.ts — Xử lý lỗi tập trung
// ============================================================
import { Request, Response, NextFunction } from 'express';

interface DbError extends Error {
  code?: string;
}

export function errorHandler(
  err: DbError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('🔥 Lỗi:', err.message);

  // Duplicate key (PostgreSQL: 23505)
  if (err.code === '23505') {
    res.status(409).json({ success: false, message: 'Dữ liệu đã tồn tại.' });
    return;
  }

  // Foreign key violation (PostgreSQL: 23503)
  if (err.code === '23503') {
    res.status(400).json({ success: false, message: 'Khoá ngoại không hợp lệ.' });
    return;
  }

  res.status(500).json({ success: false, message: err.message || 'Lỗi máy chủ.' });
}
