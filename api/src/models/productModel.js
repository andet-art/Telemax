import pool from '../config/db.js';

/* ---------- Products Model ---------- */
export const getAllProducts = async () => {
  const [rows] = await pool.query(
    `SELECT id, name, description, price, version, image_url, 
            starter_id, ring_id, top_id, stock, created_at, updated_at
     FROM products ORDER BY id DESC`
  );
  return rows;
};

export const getProductById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
  return rows[0] || null;
};

export const createProduct = async (productData) => {
  const { name, description, price, version, image_url, starter_id, ring_id, top_id, stock } = productData;
  const [result] = await pool.query(
    `INSERT INTO products (name, description, price, version, image_url, starter_id, ring_id, top_id, stock)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, description || null, price, version || null, image_url || null, 
     starter_id || null, ring_id || null, top_id || null, stock || null]
  );
  return result.insertId;
};

export const updateProduct = async (id, updates) => {
  const fields = [];
  const values = [];
  
  const allowedFields = ['name', 'description', 'price', 'version', 'image_url', 'starter_id', 'ring_id', 'top_id', 'stock'];
  
  for (const field of allowedFields) {
    if (field in updates) {
      fields.push(`${field} = ?`);
      values.push(updates[field]);
    }
  }
  
  if (fields.length === 0) return false;
  
  values.push(id);
  const [result] = await pool.query(
    `UPDATE products SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    values
  );
  
  return result.affectedRows > 0;
};

export const deleteProduct = async (id) => {
  const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

/* ---------- Parts Model ---------- */
export const getAllParts = async () => {
  const [rows] = await pool.query(
    'SELECT id, type, name, price, image_url, stock FROM parts ORDER BY type, id'
  );
  return rows;
};

export const getPartsByType = async (type) => {
  const [rows] = await pool.query(
    'SELECT id, type, name, price, image_url, stock FROM parts WHERE type = ? ORDER BY id',
    [type]
  );
  return rows;
};

export const getPartById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM parts WHERE id = ?', [id]);
  return rows[0] || null;
};

export const createPart = async (partData) => {
  const { type, name, price, image_url, stock } = partData;
  const [result] = await pool.query(
    'INSERT INTO parts (type, name, price, image_url, stock) VALUES (?, ?, ?, ?, ?)',
    [type, name || null, price || null, image_url || null, stock || 100]
  );
  return result.insertId;
};

export const updatePart = async (id, updates) => {
  const fields = [];
  const values = [];
  
  const allowedFields = ['type', 'name', 'price', 'image_url', 'stock'];
  
  for (const field of allowedFields) {
    if (field in updates) {
      fields.push(`${field} = ?`);
      values.push(updates[field]);
    }
  }
  
  if (fields.length === 0) return false;
  
  values.push(id);
  const [result] = await pool.query(
    `UPDATE parts SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  
  return result.affectedRows > 0;
};

export const deletePart = async (id) => {
  const [result] = await pool.query('DELETE FROM parts WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

export default {
  // Products
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  // Parts
  getAllParts,
  getPartsByType,
  getPartById,
  createPart,
  updatePart,
  deletePart
};