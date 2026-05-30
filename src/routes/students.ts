// ============================================================
// src/routes/students.ts — CRUD cho STUDENT
// ============================================================
import { Router, Request, Response, NextFunction } from 'express';
import { query } from '../db/db';

const router = Router();

// ── Kiểu dữ liệu ────────────────────────────────────────────
interface Student {
  sid: string;
  sname: string;
  email: string | null;
  tutor_id: string | null;
  tutorname?: string;
}

// ── GET /api/students ────────────────────────────────────────
// Lấy tất cả sinh viên (kèm tên tutor)
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const students = await query<Student>(`
      SELECT s.sid, s.sname, s.email, s.tutor_id,
             t.tname AS tutorname
      FROM   student s
      LEFT JOIN tutor t ON s.tutor_id = t.tut_id
      ORDER  BY s.sid
    `);
    res.json({ success: true, count: students.length, data: students });
  } catch (err) { next(err); }
});

// ── GET /api/students/:id ────────────────────────────────────
// Lấy 1 sinh viên + danh sách môn đã đăng kí
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const rows = await query<Student>(
      `SELECT s.sid, s.sname, s.email, s.tutor_id, t.tname AS tutorname
       FROM   student s
       LEFT JOIN tutor t ON s.tutor_id = t.tut_id
       WHERE  s.sid = $1`,
      [id]
    );

    if (!rows.length) {
      res.status(404).json({ success: false, message: `Không tìm thấy SID = ${id}` });
      return;
    }

    const enrollments = await query(
      `SELECT se.mid, m.mname, se.acad_year
       FROM   student_enrolement se
       JOIN   modules m ON se.mid = m.mid
       WHERE  se.sid = $1
       ORDER  BY se.acad_year`,
      [id]
    );

    res.json({ success: true, data: { ...rows[0], enrollments } });
  } catch (err) { next(err); }
});

// ── POST /api/students ───────────────────────────────────────
// Thêm mới sinh viên
// Body: { SID, SNAME, EMAIL?, Tutor_Id? }
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { SID, SNAME, EMAIL = null, Tutor_Id = null } = req.body as {
      SID: string; SNAME: string; EMAIL?: string; Tutor_Id?: string;
    };

    if (!SID || !SNAME) {
      res.status(400).json({ success: false, message: 'SID và SNAME là bắt buộc.' });
      return;
    }

    await query(
      'INSERT INTO student (sid, sname, email, tutor_id) VALUES ($1, $2, $3, $4)',
      [SID, SNAME, EMAIL, Tutor_Id]
    );

    res.status(201).json({
      success: true,
      message: 'Thêm sinh viên thành công.',
      data: { SID, SNAME, EMAIL, Tutor_Id },
    });
  } catch (err) { next(err); }
});

// ── PUT /api/students/:id ────────────────────────────────────
// Cập nhật sinh viên (chỉ gửi trường cần đổi)
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const existing = await query<Student>('SELECT * FROM student WHERE sid = $1', [id]);

    if (!existing.length) {
      res.status(404).json({ success: false, message: `Không tìm thấy SID = ${id}` });
      return;
    }

    const cur = existing[0];
    const { SNAME, EMAIL, Tutor_Id } = req.body as Partial<{ SNAME: string; EMAIL: string; Tutor_Id: string }>;

    const updatedName  = SNAME    ?? cur.sname;
    const updatedEmail = EMAIL    ?? cur.email;
    const updatedTutor = Tutor_Id ?? cur.tutor_id;

    await query(
      'UPDATE student SET sname = $1, email = $2, tutor_id = $3 WHERE sid = $4',
      [updatedName, updatedEmail, updatedTutor, id]
    );

    res.json({
      success: true,
      message: `Cập nhật SID = ${id} thành công.`,
      data: { sid: id, sname: updatedName, email: updatedEmail, tutor_id: updatedTutor },
    });
  } catch (err) { next(err); }
});

// ── DELETE /api/students/:id ─────────────────────────────────
// Xoá sinh viên
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const existing = await query('SELECT sid FROM student WHERE sid = $1', [id]);

    if (!existing.length) {
      res.status(404).json({ success: false, message: `Không tìm thấy SID = ${id}` });
      return;
    }

    await query('DELETE FROM student WHERE sid = $1', [id]);
    res.json({ success: true, message: `Đã xoá sinh viên SID = ${id}.` });
  } catch (err) { next(err); }
});

export default router;
