// ============================================================
// src/routes/enrollments.ts — CRUD cho STUDENT_ENROLEMENT
// ============================================================
import { Router, Request, Response, NextFunction } from 'express';
import { query } from '../db/db';

const router = Router();

// GET /api/enrollments
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const rows = await query(`
      SELECT se.sid, s.sname, se.mid, m.mname, se.acad_year
      FROM   student_enrolement se
      JOIN   student s ON se.sid = s.sid
      JOIN   modules m ON se.mid = m.mid
      ORDER  BY se.acad_year, se.sid
    `);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) { next(err); }
});

// GET /api/enrollments/:sid — Đăng kí của 1 sinh viên
router.get('/:sid', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rows = await query(
      `SELECT se.sid, s.sname, se.mid, m.mname, se.acad_year
       FROM   student_enrolement se
       JOIN   student s ON se.sid = s.sid
       JOIN   modules m ON se.mid = m.mid
       WHERE  se.sid = $1`,
      [req.params.sid]
    );
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) { next(err); }
});

// POST /api/enrollments — Đăng kí môn học
// Body: { SID, MID, ACAD_YEAR }
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { SID, MID, ACAD_YEAR } = req.body as { SID: string; MID: string; ACAD_YEAR: string };

    if (!SID || !MID || !ACAD_YEAR) {
      res.status(400).json({ success: false, message: 'SID, MID và ACAD_YEAR là bắt buộc.' });
      return;
    }

    await query(
      'INSERT INTO student_enrolement (sid, mid, acad_year) VALUES ($1, $2, $3)',
      [SID, MID, ACAD_YEAR]
    );

    res.status(201).json({ success: true, message: 'Đăng kí thành công.', data: { SID, MID, ACAD_YEAR } });
  } catch (err) { next(err); }
});

// DELETE /api/enrollments — Huỷ đăng kí
// Body: { SID, MID, ACAD_YEAR }
router.delete('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { SID, MID, ACAD_YEAR } = req.body as { SID: string; MID: string; ACAD_YEAR: string };

    if (!SID || !MID || !ACAD_YEAR) {
      res.status(400).json({ success: false, message: 'SID, MID và ACAD_YEAR là bắt buộc.' });
      return;
    }

    const deleted = await query(
      'DELETE FROM student_enrolement WHERE sid = $1 AND mid = $2 AND acad_year = $3 RETURNING *',
      [SID, MID, ACAD_YEAR]
    );

    if (!deleted.length) {
      res.status(404).json({ success: false, message: 'Không tìm thấy bản ghi.' });
      return;
    }

    res.json({ success: true, message: 'Huỷ đăng kí thành công.' });
  } catch (err) { next(err); }
});

export default router;
