import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// helpers
const toPublicUser = (u) => ({
  id: u.id, email: u.email, role: u.role,
  first_name: u.first_name, last_name: u.last_name,
  phone: u.phone, country: u.country,
  shipping_address: u.shipping_address, billing_address: u.billing_address,
  age_verified: !!u.age_verified, terms_accepted: !!u.terms_accepted, privacy_accepted: !!u.privacy_accepted, marketing_consent: !!u.marketing_consent,
  created_at: u.created_at, updated_at: u.updated_at
});

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body || {};
    if (!first_name || !last_name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
    const [exists] = await pool.query('SELECT id FROM users WHERE email=?', [email]);
    if (exists.length) return res.status(409).json({ error: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    const [r] = await pool.query(
      `INSERT INTO users (email,password,role,first_name,last_name,terms_accepted,privacy_accepted,age_verified)
       VALUES (?,?,?,?,?,'1','1','1')`,
      [email, hash, 'user', first_name, last_name]
    );
    const [rows] = await pool.query('SELECT * FROM users WHERE id=?', [r.insertId]);
    const user = rows[0];
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: toPublicUser(user) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/auth/signin
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

    const [rows] = await pool.query('SELECT * FROM users WHERE email=?', [email]);
    if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: toPublicUser(user) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id=?', [req.user.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json({ user: toPublicUser(rows[0]) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

export default router;
