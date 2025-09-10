import pool from '../config/db.js';

// Get cart for user or session
export const getCart = async (userId = null, sessionId = null) => {
  let query = 'SELECT * FROM carts WHERE expires_at > NOW()';
  let params = [];
  
  if (userId) {
    query += ' AND user_id = ?';
    params.push(userId);
  } else if (sessionId) {
    query += ' AND session_id = ?';
    params.push(sessionId);
  } else {
    return null;
  }
  
  query += ' ORDER BY updated_at DESC LIMIT 1';
  
  const [rows] = await pool.query(query, params);
  if (rows.length > 0) {
    return {
      ...rows[0],
      cart_data: JSON.parse(rows[0].cart_data)
    };
  }
  return null;
};

// Save cart
export const saveCart = async (cartData, userId = null, sessionId = null) => {
  if (!userId && !sessionId) {
    throw new Error('Either userId or sessionId must be provided');
  }
  
  const cartJson = JSON.stringify(cartData);
  
  // First try to update existing cart
  const existing = await getCart(userId, sessionId);
  
  if (existing) {
    const [result] = await pool.query(
      'UPDATE carts SET cart_data = ?, updated_at = CURRENT_TIMESTAMP, expires_at = (CURRENT_TIMESTAMP + INTERVAL 30 DAY) WHERE id = ?',
      [cartJson, existing.id]
    );
    return result.affectedRows > 0;
  } else {
    // Create new cart
    const [result] = await pool.query(
      'INSERT INTO carts (user_id, session_id, cart_data, expires_at) VALUES (?, ?, ?, (CURRENT_TIMESTAMP + INTERVAL 30 DAY))',
      [userId, sessionId, cartJson]
    );
    return result.insertId;
  }
};

// Clear cart
export const clearCart = async (userId = null, sessionId = null) => {
  if (!userId && !sessionId) {
    return false;
  }
  
  let query = 'DELETE FROM carts WHERE ';
  let params = [];
  
  if (userId) {
    query += 'user_id = ?';
    params.push(userId);
  } else {
    query += 'session_id = ?';
    params.push(sessionId);
  }
  
  const [result] = await pool.query(query, params);
  return result.affectedRows > 0;
};

// Migrate anonymous cart to user cart
export const migrateCartToUser = async (sessionId, userId) => {
  const [result] = await pool.query(
    'UPDATE carts SET user_id = ?, session_id = NULL, updated_at = CURRENT_TIMESTAMP WHERE session_id = ? AND user_id IS NULL',
    [userId, sessionId]
  );
  return result.affectedRows > 0;
};

// Clean up expired carts
export const cleanupExpiredCarts = async () => {
  const [result] = await pool.query('DELETE FROM carts WHERE expires_at <= NOW()');
  return result.affectedRows;
};

export default {
  getCart,
  saveCart,
  clearCart,
  migrateCartToUser,
  cleanupExpiredCarts
};