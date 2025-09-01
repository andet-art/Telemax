import pool from '../config/db.js';

export const adminListUsers = async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, email, role, first_name, last_name, phone, country, created_at, updated_at
       FROM users ORDER BY id DESC`
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const adminUpdateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body || {};
    if (!['user', 'admin'].includes(role)) return res.status(400).json({ error: 'Invalid role' });
    const [r] = await pool.query(`UPDATE users SET role=? WHERE id=?`, [role, id]);
    if (!r.affectedRows) return res.status(404).json({ error: 'Not found' });
    const [[row]] = await pool.query(`SELECT id,email,role FROM users WHERE id=?`, [id]);
    res.json(row);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const adminDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [r] = await pool.query(`DELETE FROM users WHERE id=?`, [id]);
    if (!r.affectedRows) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
};
