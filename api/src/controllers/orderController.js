// src/controllers/orderController.js
import pool from '../config/db.js';
import { sendOrderStatusEmail, sendTrackingEmail } from '../lib/mailer.js';
import { notifyOrderConfirmation, notifyOrderStatus } from '../services/notifications.js';

const toNum = (v) => Number.parseFloat(String(v ?? 0)) || 0;
const isCustomItem = (it) => it && it.starter_id && it.ring_id && it.top_id;

// POST /api/orders  (auth)
export const createOrder = async (req, res) => {
  const body = req.body || {};
  const name = body.name;
  const email = body.email || null;
  const phone = body.phone || null;
  const address = body.address || null;
  const notes = body.notes || null;
  const items = Array.isArray(body.items) ? body.items : [];
  if (!name || !items.length) return res.status(400).json({ error: 'Missing name or items' });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    let total = 0;
    const prepared = [];
    const stockDeltas = { products: [], parts: [] };

    for (const it of items) {
      const qty = Math.max(1, toNum(it.quantity));
      if (it.product_id) {
        const [[p]] = await conn.query('SELECT price, stock FROM products WHERE id=?', [it.product_id]);
        if (!p) throw new Error('Invalid product_id');
        const unit = toNum(p.price);
        if (p.stock !== null && p.stock !== undefined) {
          if (toNum(p.stock) < qty) throw new Error('Insufficient product stock for id=' + it.product_id);
          stockDeltas.products.push([qty, it.product_id]);
        }
        prepared.push({ product_id: it.product_id, starter_id: null, ring_id: null, top_id: null, quantity: qty, price: unit });
        total += unit * qty;
      } else if (isCustomItem(it)) {
        const ids = [it.starter_id, it.ring_id, it.top_id];
        const [rows] = await conn.query('SELECT id, price, stock FROM parts WHERE id IN (?,?,?)', ids);
        if (rows.length !== 3) throw new Error('Invalid custom part ids');
        for (const pid of ids) {
          const r = rows.find(x => x.id === pid);
          if (r && r.stock !== null && r.stock !== undefined) {
            if (toNum(r.stock) < qty) throw new Error('Insufficient part stock for id=' + pid);
            stockDeltas.parts.push([qty, pid]);
          }
        }
        const priceMap = new Map(rows.map(r => [r.id, toNum(r.price)]));
        const unit = priceMap.get(it.starter_id) + priceMap.get(it.ring_id) + priceMap.get(it.top_id);
        prepared.push({ product_id: null, starter_id: it.starter_id, ring_id: it.ring_id, top_id: it.top_id, quantity: qty, price: unit });
        total += unit * qty;
      } else {
        throw new Error('Invalid item payload');
      }
    }

    const userId = (req.user && req.user.id) ? req.user.id : null;
    const [ord] = await conn.query(
      'INSERT INTO orders (user_id,name,email,phone,address,notes,total_price,status) VALUES (?,?,?,?,?,?,?,\'pending\')',
      [userId, name, email, phone, address, notes, total.toFixed(2)]
    );

    if (prepared.length) {
      const values = prepared.map(i => [ord.insertId, i.product_id, i.starter_id, i.ring_id, i.top_id, i.quantity, toNum(i.price).toFixed(2)]);
      await conn.query('INSERT INTO order_items (order_id,product_id,starter_id,ring_id,top_id,quantity,price) VALUES ?', [values]);
    }

    for (const [q, id] of stockDeltas.products) {
      await conn.query('UPDATE products SET stock = stock - ? WHERE id=? AND stock IS NOT NULL', [q, id]);
    }
    for (const [q, id] of stockDeltas.parts) {
      await conn.query('UPDATE parts SET stock = stock - ? WHERE id=? AND stock IS NOT NULL', [q, id]);
    }

    await conn.commit();

    // Fetch items back for the email (simple fields are enough)
    const [[orderRow]] = await pool.query('SELECT id,name,email,total_price FROM orders WHERE id=?', [ord.insertId]);
    const [itemsRows]  = await pool.query('SELECT product_id,starter_id,ring_id,top_id,quantity,price FROM order_items WHERE order_id=?', [ord.insertId]);

    // Fire-and-forget email (don't block response if it fails)
    notifyOrderConfirmation(orderRow, itemsRows).catch(err => {
      console.error('Order confirmation email failed:', err.message);
    });

    res.status(201).json({ ok: true, order_id: ord.insertId, total: Number(total.toFixed(2)) });
  } catch (e) {
    await conn.rollback();
    res.status(400).json({ error: e.message });
  } finally {
    conn.release();
  }
};

// GET /api/orders/mine (auth)
export const listMyOrders = async (req, res) => {
  try {
    const uid = req.user && req.user.id;
    if (!uid) return res.status(401).json({ error: 'Unauthorized' });
    const [orders] = await pool.query('SELECT id,name,total_price,status,created_at FROM orders WHERE user_id=? ORDER BY id DESC', [uid]);
    for (const o of orders) {
      const [items] = await pool.query('SELECT id,product_id,starter_id,ring_id,top_id,quantity,price FROM order_items WHERE order_id=?', [o.id]);
      o.items = items;
    }
    res.json(orders);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// GET /api/orders/:id (owner or admin)
export const getOrderById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [[o]] = await pool.query('SELECT * FROM orders WHERE id=?', [id]);
    if (!o) return res.status(404).json({ error: 'Not found' });
    const isOwner = req.user && req.user.id && o.user_id === req.user.id;
    const isAdmin = req.user && req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ error: 'Forbidden' });
    const [items] = await pool.query('SELECT id,product_id,starter_id,ring_id,top_id,quantity,price FROM order_items WHERE order_id=?', [id]);
    o.items = items;
    res.json(o);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// GET /api/admin/orders (admin)
export const adminListOrders = async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT id,user_id,name,email,phone,total_price,status,created_at FROM orders ORDER BY id DESC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// PUT /api/admin/orders/:id/status  (admin)
export const adminUpdateOrderStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const status = String(req.body?.status || '').toLowerCase();
    const allowed = new Set(['pending','paid','processing','shipped','completed','cancelled']);
    if (!allowed.has(status)) return res.status(400).json({ error: 'Invalid status' });

    await pool.query('UPDATE orders SET status=? WHERE id=?', [status, id]);
    const [[row]] = await pool.query('SELECT id,name,email,status,tracking_number FROM orders WHERE id=?', [id]);

    // Notify user
    notifyOrderStatus(row).catch(err => console.error('Status email failed:', err.message));

    res.json({ id: row.id, status: row.status, tracking_number: row.tracking_number || null, updated_at: new Date().toISOString() });
  } catch (e) { res.status(400).json({ error: e.message }); }
};

// PUT /api/admin/orders/:id/tracking  (admin)

// Admin: update order status
export const adminUpdateStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body || {};
    const allowed = new Set(['pending','paid','processing','shipped','completed','cancelled']);
    if (!allowed.has(status)) return res.status(400).json({ error: 'Invalid status' });

    await (await import('../config/db.js')).default.query(
      "UPDATE orders SET status=?, updated_at=NOW() WHERE id=?",
      [status, id]
    );

    const [[order]] = await (await import('../config/db.js')).default.query(
      "SELECT id,name,email,tracking_number,status,updated_at FROM orders WHERE id=?",
      [id]
    );
    if (!order) return res.status(404).json({ error: 'Not found' });

    // fire-and-forget email (file-mode writes .eml)
    sendOrderStatusEmail(order).catch(err => console.error('Status email error:', err.message));
    res.json({ id: order.id, status: order.status, tracking_number: order.tracking_number, updated_at: order.updated_at });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// Admin: set tracking number
export const adminSetTracking = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { tracking_number } = req.body || {};
    if (!tracking_number) return res.status(400).json({ error: 'tracking_number required' });

    await (await import('../config/db.js')).default.query(
      "UPDATE orders SET tracking_number=?, updated_at=NOW() WHERE id=?",
      [tracking_number, id]
    );

    const [[order]] = await (await import('../config/db.js')).default.query(
      "SELECT id,name,email,tracking_number,status,updated_at FROM orders WHERE id=?",
      [id]
    );
    if (!order) return res.status(404).json({ error: 'Not found' });

    // fire-and-forget email (file-mode writes .eml)
    sendTrackingEmail(order).catch(err => console.error('Tracking email error:', err.message));
    res.json({ id: order.id, tracking_number: order.tracking_number, status: order.status, updated_at: order.updated_at });
  } catch (e) { res.status(500).json({ error: e.message }); }
};
