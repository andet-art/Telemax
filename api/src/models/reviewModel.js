import pool from '../config/db.js';

// Get reviews for a product
export const getProductReviews = async (productId, options = {}) => {
  let query = `
    SELECT r.*, u.first_name, u.last_name 
    FROM reviews r 
    JOIN users u ON r.user_id = u.id 
    WHERE r.product_id = ? AND r.is_approved = 1
  `;
  const values = [productId];
  
  if (options.rating) {
    query += ' AND r.rating = ?';
    values.push(options.rating);
  }
  
  query += ' ORDER BY r.created_at DESC';
  
  if (options.limit) {
    const offset = (options.page - 1) * options.limit || 0;
    query += ` LIMIT ${offset}, ${options.limit}`;
  }
  
  const [reviews] = await pool.query(query, values);
  
  // Get review statistics
  const [stats] = await pool.query(`
    SELECT 
      COUNT(*) as total_reviews,
      AVG(rating) as average_rating,
      SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
      SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
      SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
      SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
      SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
    FROM reviews 
    WHERE product_id = ? AND is_approved = 1
  `, [productId]);
  
  return {
    reviews,
    stats: stats[0]
  };
};

// Create a new review
export const createReview = async (data) => {
  // Check if user already reviewed this product
  const [existing] = await pool.query(
    'SELECT id FROM reviews WHERE user_id = ? AND product_id = ?',
    [data.user_id, data.product_id]
  );
  
  if (existing.length > 0) {
    throw new Error('User has already reviewed this product');
  }
  
  // Check if it's a verified purchase
  const [order] = await pool.query(`
    SELECT o.id 
    FROM orders o 
    JOIN order_items oi ON o.id = oi.order_id 
    WHERE o.user_id = ? AND oi.product_id = ? AND o.status IN ('shipped', 'completed')
  `, [data.user_id, data.product_id]);
  
  const isVerifiedPurchase = order.length > 0;
  
  const [result] = await pool.query(`
    INSERT INTO reviews (user_id, product_id, order_id, rating, title, comment, is_verified_purchase, is_approved)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    data.user_id,
    data.product_id,
    order.length > 0 ? order[0].id : null,
    data.rating,
    data.title || null,
    data.comment || null,
    isVerifiedPurchase ? 1 : 0,
    1 // Auto-approve for now, can be changed to require moderation
  ]);
  
  return result.insertId;
};

// Update review
export const updateReview = async (reviewId, userId, data) => {
  const fields = [];
  const values = [];
  
  const allowedFields = ['rating', 'title', 'comment'];
  
  for (const field of allowedFields) {
    if (field in data) {
      fields.push(`${field} = ?`);
      values.push(data[field]);
    }
  }
  
  if (fields.length === 0) return false;
  
  values.push(reviewId, userId);
  const [result] = await pool.query(
    `UPDATE reviews SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?`,
    values
  );
  
  return result.affectedRows > 0;
};

// Delete review
export const deleteReview = async (reviewId, userId) => {
  const [result] = await pool.query('DELETE FROM reviews WHERE id = ? AND user_id = ?', [reviewId, userId]);
  return result.affectedRows > 0;
};

// Get user's reviews
export const getUserReviews = async (userId, options = {}) => {
  let query = `
    SELECT r.*, p.name as product_name 
    FROM reviews r 
    JOIN products p ON r.product_id = p.id 
    WHERE r.user_id = ?
  `;
  const values = [userId];
  
  query += ' ORDER BY r.created_at DESC';
  
  if (options.limit) {
    const offset = (options.page - 1) * options.limit || 0;
    query += ` LIMIT ${offset}, ${options.limit}`;
  }
  
  const [reviews] = await pool.query(query, values);
  return reviews;
};

// Moderate review (admin)
export const moderateReview = async (reviewId, isApproved) => {
  const [result] = await pool.query('UPDATE reviews SET is_approved = ? WHERE id = ?', [isApproved ? 1 : 0, reviewId]);
  return result.affectedRows > 0;
};

export default {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  getUserReviews,
  moderateReview
};