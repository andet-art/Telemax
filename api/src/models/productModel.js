import pool from '../config/db.js';

/* ---------- Products Model ---------- */
export const getAllProducts = async (options = {}) => {
  let query = `
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.is_active = 1
  `;
  const values = [];
  
  if (options.category_id) {
    query += ' AND p.category_id = ?';
    values.push(options.category_id);
  }
  
  if (options.featured) {
    query += ' AND p.featured = 1';
  }
  
  if (options.search) {
    query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
    const searchTerm = `%${options.search}%`;
    values.push(searchTerm, searchTerm);
  }
  
  if (options.min_price) {
    query += ' AND p.price >= ?';
    values.push(options.min_price);
  }
  
  if (options.max_price) {
    query += ' AND p.price <= ?';
    values.push(options.max_price);
  }
  
  // Sorting
  switch (options.sort) {
    case 'price_asc':
      query += ' ORDER BY p.price ASC';
      break;
    case 'price_desc':
      query += ' ORDER BY p.price DESC';
      break;
    case 'name_asc':
      query += ' ORDER BY p.name ASC';
      break;
    case 'name_desc':
      query += ' ORDER BY p.name DESC';
      break;
    case 'newest':
      query += ' ORDER BY p.created_at DESC';
      break;
    case 'featured':
      query += ' ORDER BY p.featured DESC, p.created_at DESC';
      break;
    default:
      query += ' ORDER BY p.id DESC';
  }
  
  // Pagination
  if (options.limit) {
    const offset = (options.page - 1) * options.limit || 0;
    query += ` LIMIT ${offset}, ${options.limit}`;
  }
  
  const [rows] = await pool.query(query, values);
  return rows;
};

export const getProductById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
  return rows[0] || null;
};

export const createProduct = async (productData) => {
  const { 
    name, description, price, version, sku, image_url, weight, dimensions,
    starter_id, ring_id, top_id, stock, category_id, is_active, featured
  } = productData;
  
  const [result] = await pool.query(
    `INSERT INTO products (name, description, price, version, sku, image_url, weight, dimensions,
                          starter_id, ring_id, top_id, stock, category_id, is_active, featured)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, description || null, price, version || null, sku || null, image_url || null,
     weight || null, dimensions || null, starter_id || null, ring_id || null, top_id || null, 
     stock || 0, category_id || null, is_active !== false ? 1 : 0, featured ? 1 : 0]
  );
  return result.insertId;
};

export const updateProduct = async (id, updates) => {
  const fields = [];
  const values = [];
  
  const allowedFields = ['name', 'description', 'price', 'version', 'sku', 'image_url', 'weight', 'dimensions',
                        'starter_id', 'ring_id', 'top_id', 'stock', 'category_id', 'is_active', 'featured'];
  
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

// Get product with enhanced details including category and images
export const getProductWithDetails = async (id) => {
  const [products] = await pool.query(`
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = ? AND p.is_active = 1
  `, [id]);
  
  if (products.length === 0) return null;
  
  const product = products[0];
  
  // Get product images
  const [images] = await pool.query(
    'SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, sort_order ASC',
    [id]
  );
  
  product.images = images;
  return product;
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
  getProductWithDetails,
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