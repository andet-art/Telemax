import pool from '../config/db.js';

export const setProductStock = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { stock } = req.body || {};
    if (!Number.isInteger(stock) || stock < 0) return res.status(400).json({ error: 'stock must be >= 0 integer' });
    await pool.query('UPDATE products SET stock=? WHERE id=?', [stock, id]);
    const [[row]] = await pool.query('SELECT id,name,stock FROM products WHERE id=?', [id]);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const setPartStock = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { stock } = req.body || {};
    if (!Number.isInteger(stock) || stock < 0) return res.status(400).json({ error: 'stock must be >= 0 integer' });
    await pool.query('UPDATE parts SET stock=? WHERE id=?', [stock, id]);
    const [[row]] = await pool.query('SELECT id,type,name,stock FROM parts WHERE id=?', [id]);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (e) { res.status(500).json({ error: e.message }); }
};
