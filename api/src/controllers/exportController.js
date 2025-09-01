import pool from '../config/db.js';

function rowsToCsv(rows, headers) {
  const esc = (v) => {
    if (v === null || v === undefined) return '';
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const head = headers.map(h => esc(h.label)).join(',');
  const body = rows.map(r => headers.map(h => esc(r[h.key])).join(',')).join('\n');
  return head + '\n' + body + '\n';
}

export const exportOrdersCsv = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT o.id, o.name, o.email, o.phone, o.address, o.total_price, o.status,
              o.tracking_number, o.created_at,
              COUNT(oi.id) AS items_count
         FROM orders o
         LEFT JOIN order_items oi ON oi.order_id = o.id
        GROUP BY o.id
        ORDER BY o.id DESC`
    );
    const csv = rowsToCsv(rows, [
      { key: 'id', label: 'id' },
      { key: 'name', label: 'name' },
      { key: 'email', label: 'email' },
      { key: 'phone', label: 'phone' },
      { key: 'address', label: 'address' },
      { key: 'total_price', label: 'total_price' },
      { key: 'status', label: 'status' },
      { key: 'tracking_number', label: 'tracking_number' },
      { key: 'items_count', label: 'items_count' },
      { key: 'created_at', label: 'created_at' },
    ]);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="orders.csv"');
    res.send(csv);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const exportUsersCsv = async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, email, role, first_name, last_name, phone, country, created_at
         FROM users ORDER BY id DESC`
    );
    const csv = rowsToCsv(rows, [
      { key: 'id', label: 'id' },
      { key: 'email', label: 'email' },
      { key: 'role', label: 'role' },
      { key: 'first_name', label: 'first_name' },
      { key: 'last_name', label: 'last_name' },
      { key: 'phone', label: 'phone' },
      { key: 'country', label: 'country' },
      { key: 'created_at', label: 'created_at' },
    ]);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="users.csv"');
    res.send(csv);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

export const exportProductsCsv = async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, price, version, stock, created_at, updated_at
         FROM products ORDER BY id DESC`
    );
    const csv = rowsToCsv(rows, [
      { key: 'id', label: 'id' },
      { key: 'name', label: 'name' },
      { key: 'price', label: 'price' },
      { key: 'version', label: 'version' },
      { key: 'stock', label: 'stock' },
      { key: 'created_at', label: 'created_at' },
      { key: 'updated_at', label: 'updated_at' },
    ]);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="products.csv"');
    res.send(csv);
  } catch (e) { res.status(500).json({ error: e.message }); }
};
