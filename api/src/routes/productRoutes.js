import express from 'express';
import pool from '../config/db.js';
const router = express.Router();

// all products
router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id,name,description,price,version,image_url,starter_id,ring_id,top_id 
       FROM products ORDER BY id DESC`
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// single product
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM products WHERE id=?`, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// all parts
router.get('/parts/all', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id,type,name,price,image_url FROM parts ORDER BY type,id'
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

export default router;
