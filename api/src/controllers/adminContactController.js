import pool from '../config/db.js';

export const adminListContacts = async (req, res) => {
  try {
    const status = (req.query.status || 'open').toLowerCase();
    const where = status === 'all' ? '1=1' : 'status = ?';
    const params = status === 'all' ? [] : [status];
    const [rows] = await pool.query(
      `SELECT id,first_name,last_name,email,subject,message,status,
              handled_by,handled_at,admin_note,created_at
       FROM contact_messages
       WHERE ${where}
       ORDER BY created_at DESC
       LIMIT 200`, params);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const adminGetContact = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [[row]] = await pool.query(`SELECT * FROM contact_messages WHERE id=?`, [id]);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const adminResolveContact = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const note = req.body?.note || null;
    const uid = req.user?.id ?? null;
    await pool.query(
      `UPDATE contact_messages
       SET status='closed', handled_by=?, handled_at=NOW(), admin_note=?
       WHERE id=?`, [uid, note, id]);
    const [[row]] = await pool.query(
      `SELECT id,status,handled_by,handled_at,admin_note FROM contact_messages WHERE id=?`, [id]);
    res.json(row);
  } catch (e) { res.status(500).json({ error: e.message }); }
};
