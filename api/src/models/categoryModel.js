import pool from '../config/db.js';

// Get all categories with optional parent filtering
export const getAllCategories = async (parentId = null) => {
  let query = 'SELECT * FROM categories WHERE is_active = 1';
  const values = [];
  
  if (parentId !== null) {
    query += ' AND parent_id = ?';
    values.push(parentId);
  } else if (parentId === null) {
    query += ' AND parent_id IS NULL';
  }
  
  query += ' ORDER BY sort_order ASC, name ASC';
  
  const [rows] = await pool.query(query, values);
  return rows;
};

// Get category by ID
export const getCategoryById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
  return rows[0] || null;
};

// Get category by slug
export const getCategoryBySlug = async (slug) => {
  const [rows] = await pool.query('SELECT * FROM categories WHERE slug = ? AND is_active = 1', [slug]);
  return rows[0] || null;
};

// Create new category
export const createCategory = async (data) => {
  const [result] = await pool.query(
    `INSERT INTO categories (name, slug, description, image_url, parent_id, sort_order, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [data.name, data.slug, data.description || null, data.image_url || null, 
     data.parent_id || null, data.sort_order || 0, data.is_active !== false ? 1 : 0]
  );
  return result.insertId;
};

// Update category
export const updateCategory = async (id, data) => {
  const fields = [];
  const values = [];
  
  const allowedFields = ['name', 'slug', 'description', 'image_url', 'parent_id', 'sort_order', 'is_active'];
  
  for (const field of allowedFields) {
    if (field in data) {
      fields.push(`${field} = ?`);
      values.push(data[field]);
    }
  }
  
  if (fields.length === 0) return false;
  
  values.push(id);
  const [result] = await pool.query(
    `UPDATE categories SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    values
  );
  
  return result.affectedRows > 0;
};

// Delete category
export const deleteCategory = async (id) => {
  const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

// Get categories with product count
export const getCategoriesWithProductCount = async () => {
  const [rows] = await pool.query(`
    SELECT c.*, COUNT(p.id) as product_count 
    FROM categories c 
    LEFT JOIN products p ON c.id = p.category_id AND p.is_active = 1
    WHERE c.is_active = 1
    GROUP BY c.id 
    ORDER BY c.sort_order ASC, c.name ASC
  `);
  return rows;
};

export default {
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoriesWithProductCount
};