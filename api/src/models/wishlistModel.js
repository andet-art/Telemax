import pool from '../config/db.js';

// Get user's wishlist
export const getUserWishlist = async (userId) => {
  const [rows] = await pool.query(`
    SELECT w.*, p.name, p.description, p.price, p.image_url, p.is_active
    FROM wishlists w
    JOIN products p ON w.product_id = p.id
    WHERE w.user_id = ? AND p.is_active = 1
    ORDER BY w.created_at DESC
  `, [userId]);
  
  return rows;
};

// Add product to wishlist
export const addToWishlist = async (userId, productId) => {
  try {
    const [result] = await pool.query(
      'INSERT INTO wishlists (user_id, product_id) VALUES (?, ?)',
      [userId, productId]
    );
    return result.insertId;
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('Product already in wishlist');
    }
    throw error;
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (userId, productId) => {
  const [result] = await pool.query(
    'DELETE FROM wishlists WHERE user_id = ? AND product_id = ?',
    [userId, productId]
  );
  return result.affectedRows > 0;
};

// Check if product is in user's wishlist
export const isInWishlist = async (userId, productId) => {
  const [rows] = await pool.query(
    'SELECT id FROM wishlists WHERE user_id = ? AND product_id = ?',
    [userId, productId]
  );
  return rows.length > 0;
};

// Get wishlist count for user
export const getWishlistCount = async (userId) => {
  const [rows] = await pool.query(
    'SELECT COUNT(*) as count FROM wishlists w JOIN products p ON w.product_id = p.id WHERE w.user_id = ? AND p.is_active = 1',
    [userId]
  );
  return rows[0].count;
};

// Clear user's wishlist
export const clearWishlist = async (userId) => {
  const [result] = await pool.query('DELETE FROM wishlists WHERE user_id = ?', [userId]);
  return result.affectedRows;
};

export default {
  getUserWishlist,
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
  getWishlistCount,
  clearWishlist
};