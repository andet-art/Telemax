import pool from '../config/db.js';

export const submitContact = async (req, res) => {
  try {
    const { first_name=null,last_name=null,email=null,subject=null,message } = req.body || {};
    if (!message) return res.status(400).json({ error: 'message is required' });
    const userId = req.user?.id ?? null;
    const [r] = await pool.query(
      `INSERT INTO contact (first_name,last_name,email,phone,company,subject,message)
       VALUES (?,?,?,?,?,?,?)`,
      [first_name, last_name, email, req.body.phone||null, req.body.company||null, subject, message]
    );
    res.status(201).json({ ok:true, id:r.insertId });
  } catch (e) { res.status(500).json({ error:e.message }); }
};

/* ------- Admin ------- */
export const adminListMessages = async (_req,res)=>{
  try {
    const [rows] = await pool.query(
      `SELECT id,first_name,last_name,email,phone,company,subject,created_at
       FROM contact ORDER BY id DESC`
    );
    res.json(rows);
  } catch(e){ res.status(500).json({ error:e.message }); }
};

export const adminGetMessage = async (req,res)=>{
  try {
    const { id } = req.params;
    const [[row]] = await pool.query(`SELECT * FROM contact WHERE id=?`,[id]);
    if (!row) return res.status(404).json({ error:'Not found' });
    res.json(row);
  } catch(e){ res.status(500).json({ error:e.message }); }
};

export const adminUpdateMessage = async (req,res)=>{
  try {
    const { id } = req.params;
    const { message } = req.body || {};
    if (!message) return res.status(400).json({ error:'No message to update' });
    const [r] = await pool.query(`UPDATE contact SET message=? WHERE id=?`, [message, id]);
    if (!r.affectedRows) return res.status(404).json({ error:'Not found' });
    const [[row]] = await pool.query(`SELECT * FROM contact WHERE id=?`,[id]);
    res.json(row);
  } catch(e){ res.status(500).json({ error:e.message }); }
};

export const adminDeleteMessage = async (req,res)=>{
  try {
    const { id } = req.params;
    const [r] = await pool.query(`DELETE FROM contact WHERE id=?`,[id]);
    if (!r.affectedRows) return res.status(404).json({ error:'Not found' });
    res.json({ ok:true });
  } catch(e){ res.status(500).json({ error:e.message }); }
};
