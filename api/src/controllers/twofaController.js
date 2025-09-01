import pool from '../config/db.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendEmail } from '../utils/mailer.js';

export const request2FA = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });
    const [u] = await pool.query('SELECT id FROM users WHERE email=?', [email]);
    if (!u.length) return res.status(404).json({ error: 'User not found' });
    const code = crypto.randomInt(100000, 999999).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000);
    await pool.query('UPDATE users SET two_factor_code=?, two_factor_expires=? WHERE id=?', [code, expires, u[0].id]);
    await sendEmail(email, 'Telemax 2FA Code', `Your verification code is: ${code}`);
    res.json({ message: 'Code sent' });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const verify2FA = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ error: 'Email and code required' });
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email=? AND two_factor_code=? AND two_factor_expires > NOW()',
      [email, code]
    );
    if (!rows.length) return res.status(400).json({ error: 'Invalid or expired code' });
    const user = rows[0];
    await pool.query(
      'UPDATE users SET two_factor_code=NULL, two_factor_expires=NULL, two_factor_enabled=1 WHERE id=?',
      [user.id]
    );
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role, first_name: user.first_name, last_name: user.last_name } });
  } catch (e) { res.status(500).json({ error: e.message }); }
};
