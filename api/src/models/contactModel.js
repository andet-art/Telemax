import pool from '../config/db.js';

/* ---------- Contact Model ---------- */
export const createContactMessage = async (contactData) => {
  const { first_name, last_name, email, phone, company, subject, message } = contactData;
  
  if (!message) {
    throw new Error('Message is required');
  }
  
  const [result] = await pool.query(
    `INSERT INTO contact (first_name, last_name, email, phone, company, subject, message, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
    [first_name || null, last_name || null, email || null, phone || null, 
     company || null, subject || null, message]
  );
  
  return result.insertId;
};

export const getAllContactMessages = async () => {
  const [rows] = await pool.query(
    `SELECT id, first_name, last_name, email, phone, company, subject, 
            message, created_at 
     FROM contact 
     ORDER BY created_at DESC`
  );
  return rows;
};

export const getContactMessageById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM contact WHERE id = ?', [id]);
  return rows[0] || null;
};

export const updateContactMessage = async (id, updates) => {
  const fields = [];
  const values = [];
  
  const allowedFields = ['first_name', 'last_name', 'email', 'phone', 'company', 'subject', 'message'];
  
  for (const field of allowedFields) {
    if (field in updates) {
      fields.push(`${field} = ?`);
      values.push(updates[field]);
    }
  }
  
  if (fields.length === 0) return false;
  
  values.push(id);
  const [result] = await pool.query(
    `UPDATE contact SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  
  return result.affectedRows > 0;
};

export const deleteContactMessage = async (id) => {
  const [result] = await pool.query('DELETE FROM contact WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

export default {
  createContactMessage,
  getAllContactMessages,
  getContactMessageById,
  updateContactMessage,
  deleteContactMessage
};