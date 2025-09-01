import pool from '../config/db.js';

export const getAdminStats = async (_req, res) => {
  try {
    const [[u]] = await pool.query('SELECT COUNT(*) AS users FROM users');
    const [[o]] = await pool.query('SELECT COUNT(*) AS orders, COALESCE(SUM(total_price),0) AS revenue FROM orders');
    const [recent] = await pool.query(
      `SELECT id,name,total_price,status,created_at FROM orders ORDER BY id DESC LIMIT 10`
    );
    res.json({ users: u.users, orders: o.orders, revenue: Number(o.revenue), recent });
  } catch (e) { res.status(500).json({ error: e.message }); }
};
