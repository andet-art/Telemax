import pool from '../config/db.js';

export const submitContact = async (req, res) => {
  try {
    const { first_name=null,last_name=null,email=null,subject=null,message } = req.body || {};
    if (!message) return res.status(400).json({ error: 'message is required' });
    const userId = req.user?.id ?? null;
    const [r] = await pool.query(
      `INSERT INTO contact_messages (user_id,first_name,last_name,email,subject,message)
       VALUES (?,?,?,?,?,?)`,
      [userId, first_name, last_name, email, subject, message]
    );
    res.status(201).json({ ok:true, id:r.insertId });
  } catch (e) { res.status(500).json({ error:e.message }); }
};

/* ------- Admin ------- */
export const adminListMessages = async (_req,res)=>{
  try {
    const [rows] = await pool.query(
      `SELECT id,user_id,first_name,last_name,email,subject,status,created_at
       FROM contact_messages ORDER BY id DESC`
    );
    res.json(rows);
  } catch(e){ res.status(500).json({ error:e.message }); }
};

export const adminGetMessage = async (req,res)=>{
  try {
    const { id } = req.params;
    const [[row]] = await pool.query(`SELECT * FROM contact_messages WHERE id=?`,[id]);
    if (!row) return res.status(404).json({ error:'Not found' });
    res.json(row);
  } catch(e){ res.status(500).json({ error:e.message }); }
};

export const adminUpdateMessage = async (req,res)=>{
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body || {};
    const sets = []; const vals = [];
    if (status) { sets.push('status=?'); vals.push(status); }
    if (admin_notes !== undefined) { sets.push('admin_notes=?'); vals.push(admin_notes); }
    if (!sets.length) return res.status(400).json({ error:'No fields to update' });
    vals.push(id);
    const [r] = await pool.query(`UPDATE contact_messages SET ${sets.join(', ')} WHERE id=?`, vals);
    if (!r.affectedRows) return res.status(404).json({ error:'Not found' });
    const [[row]] = await pool.query(`SELECT * FROM contact_messages WHERE id=?`,[id]);
    res.json(row);
  } catch(e){ res.status(500).json({ error:e.message }); }
};

export const adminDeleteMessage = async (req,res)=>{
  try {
    const { id } = req.params;
    const [r] = await pool.query(`DELETE FROM contact_messages WHERE id=?`,[id]);
    if (!r.affectedRows) return res.status(404).json({ error:'Not found' });
    res.json({ ok:true });
  } catch(e){ res.status(500).json({ error:e.message }); }
};
