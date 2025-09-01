import pool from '../config/db.js';

export const findUserByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
};

export const createUser = async (data) => {
  const [result] = await pool.query(
    `INSERT INTO users (email, password, role, first_name, last_name, phone, date_of_birth, country, shipping_address, billing_address, age_verified, terms_accepted, privacy_accepted, marketing_consent)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [data.email, data.password, data.role || 'user', data.first_name, data.last_name, data.phone,
     data.date_of_birth, data.country, data.shipping_address, data.billing_address,
     data.age_verified, data.terms_accepted, data.privacy_accepted, data.marketing_consent]
  );
  return result.insertId;
};
