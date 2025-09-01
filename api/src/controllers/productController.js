import pool from '../config/db.js';

/* ---------- Public Products ---------- */
export const listProducts = async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products ORDER BY id DESC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const [[row]] = await pool.query('SELECT * FROM products WHERE id=?', [id]);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

/* Back-compat aliases (in case routes use other names) */
export const getProducts = listProducts;
export const getProduct = getProductById;

/* ---------- Admin Products ---------- */
export const adminListProducts = async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products ORDER BY id DESC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const adminCreateProduct = async (req, res) => {
  try {
    const { name, description=null, price, version=null, image_url=null,
            starter_id=null, ring_id=null, top_id=null } = req.body || {};
    if (!name || price == null) return res.status(400).json({ error: 'name and price are required' });
    const [r] = await pool.query(
      `INSERT INTO products (name,description,price,version,image_url,starter_id,ring_id,top_id)
       VALUES (?,?,?,?,?,?,?,?)`,
      [name, description, price, version, image_url, starter_id, ring_id, top_id]
    );
    const [[row]] = await pool.query('SELECT * FROM products WHERE id=?', [r.insertId]);
    res.status(201).json(row);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const adminUpdateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const fields = ['name','description','price','version','image_url','starter_id','ring_id','top_id'];
    const data = req.body || {};
    const sets = []; const vals = [];
    for (const f of fields) if (f in data) { sets.push(`${f} = ?`); vals.push(data[f]); }
    if (!sets.length) return res.status(400).json({ error: 'No fields to update' });
    vals.push(id);
    const [r] = await pool.query(`UPDATE products SET ${sets.join(', ')} WHERE id=?`, vals);
    if (!r.affectedRows) return res.status(404).json({ error: 'Not found' });
    const [[row]] = await pool.query('SELECT * FROM products WHERE id=?', [id]);
    res.json(row);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const adminDeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const [r] = await pool.query('DELETE FROM products WHERE id=?', [id]);
    if (!r.affectedRows) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
};
