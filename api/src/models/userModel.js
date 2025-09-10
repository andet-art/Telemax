import pool from '../config/db.js';

export const findUserByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
};

export const createUser = async (data) => {
  const [result] = await pool.query(
    `INSERT INTO users (email, email_verified, password, role, first_name, last_name, phone, date_of_birth, country, shipping_address, billing_address, age_verified, terms_accepted, privacy_accepted, marketing_consent, profile_image_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [data.email, data.email_verified || 0, data.password, data.role || 'user', data.first_name, data.last_name, data.phone,
     data.date_of_birth, data.country, data.shipping_address, data.billing_address,
     data.age_verified, data.terms_accepted, data.privacy_accepted, data.marketing_consent, data.profile_image_url || null]
  );
  return result.insertId;
};

// Email verification functions
export const setEmailVerificationToken = async (userId, token) => {
  await pool.query('UPDATE users SET email_verification_token = ? WHERE id = ?', [token, userId]);
};

export const verifyEmailToken = async (token) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email_verification_token = ?', [token]);
  if (rows.length > 0) {
    await pool.query('UPDATE users SET email_verified = 1, email_verification_token = NULL WHERE id = ?', [rows[0].id]);
    return rows[0];
  }
  return null;
};

// Password reset functions
export const setPasswordResetToken = async (email, token, expires) => {
  await pool.query('UPDATE users SET password_reset_token = ?, password_reset_expires = ? WHERE email = ?', [token, expires, email]);
};

export const findByPasswordResetToken = async (token) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE password_reset_token = ? AND password_reset_expires > NOW()', [token]);
  return rows[0] || null;
};

export const updatePassword = async (userId, hashedPassword) => {
  await pool.query('UPDATE users SET password = ?, password_reset_token = NULL, password_reset_expires = NULL WHERE id = ?', [hashedPassword, userId]);
};

// Update user profile
export const updateUserProfile = async (userId, data) => {
  const fields = [];
  const values = [];
  
  const allowedFields = ['first_name', 'last_name', 'phone', 'date_of_birth', 'country', 'shipping_address', 'billing_address', 'profile_image_url'];
  
  for (const field of allowedFields) {
    if (field in data) {
      fields.push(`${field} = ?`);
      values.push(data[field]);
    }
  }
  
  if (fields.length === 0) return false;
  
  values.push(userId);
  const [result] = await pool.query(
    `UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    values
  );
  
  return result.affectedRows > 0;
};
