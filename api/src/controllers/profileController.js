import pool from '../config/db.js';

export const getMe = async (req,res)=>{
  try{
    const [[u]] = await pool.query(
      `SELECT id,email,role,first_name,last_name,phone,country,shipping_address,billing_address,created_at,updated_at
       FROM users WHERE id=?`, [req.user.id]
    );
    res.json({ user:u });
  }catch(e){ res.status(500).json({ error:e.message }); }
};

export const updateMe = async (req,res)=>{
  try{
    const allowed = ['first_name','last_name','phone','country','shipping_address','billing_address','marketing_consent'];
    const data = req.body || {};
    const sets=[]; const vals=[];
    for (const f of allowed) if (f in data){ sets.push(`${f}=?`); vals.push(data[f]); }
    if (!sets.length) return res.status(400).json({ error:'No fields to update' });
    vals.push(req.user.id);
    await pool.query(`UPDATE users SET ${sets.join(', ')} WHERE id=?`, vals);
    const [[u]] = await pool.query(
      `SELECT id,email,role,first_name,last_name,phone,country,shipping_address,billing_address,created_at,updated_at
       FROM users WHERE id=?`, [req.user.id]
    );
    res.json({ user:u });
  }catch(e){ res.status(500).json({ error:e.message }); }
};
