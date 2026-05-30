// ============================================================
// src/db/db.ts — Hàm kết nối DB dùng chung (PostgreSQL Pool)
// ============================================================
import { Pool, QueryResult } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Tạo Pool — tái sử dụng kết nối, không tạo mới mỗi request
const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     Number(process.env.DB_PORT) || 5432,
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME     || 'studentsreg',
});

/**
 * Hàm chung để chạy SQL — dùng ở mọi route
 * PostgreSQL dùng $1, $2, $3 ... thay vì ?
 *
 * @example
 *   const rows = await query('SELECT * FROM student WHERE sid = $1', ['1000']);
 */
export async function query<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  const result: QueryResult<T> = await pool.query(sql, params);
  return result.rows;
}

/** Kiểm tra kết nối khi app khởi động */
export async function testConnection(): Promise<void> {
  const client = await pool.connect();
  console.log('✅  Kết nối PostgreSQL thành công!');
  client.release();
}
