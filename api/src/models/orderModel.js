import pool from '../config/db.js';

export const createOrderWithItems = async ({ user_id, full_name, email, phone, address, notes, items }) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const prodIds = items.filter(i=>i.product_id).map(i=>i.product_id);
    const [prods] = prodIds.length
      ? await conn.query(`SELECT id, price FROM products WHERE id IN (${prodIds.map(()=>'?').join(',')})`, prodIds)
      : [[]];
    const prodPrice = new Map(prods.map(p=>[p.id, Number(p.price)]));

    const partIds = [...new Set(items.flatMap(i=>[i.starter_id,i.ring_id,i.top_id]).filter(Boolean))];
    const [parts] = partIds.length
      ? await conn.query(`SELECT id, price FROM parts WHERE id IN (${partIds.map(()=>'?').join(',')})`, partIds)
      : [[]];
    const partPrice = new Map(parts.map(p=>[p.id, Number(p.price||0)]));

    let total = 0;
    const normalized = items.map(i=>{
      const qty = Math.max(1, Number(i.quantity||1));
      let unit = 0;
      if (i.product_id) unit = prodPrice.get(i.product_id) ?? 0;
      else unit = (partPrice.get(i.starter_id)||0) + (partPrice.get(i.ring_id)||0) + (partPrice.get(i.top_id)||0);
      total += unit * qty;
      return { ...i, quantity: qty, price: unit };
    });

    const [orderRes] = await conn.query(
      `INSERT INTO orders (user_id,total_price,name,email,phone,address,notes,status,payment_status,created_at)
       VALUES (?,?,?,?,?,?,?,'pending','pending',NOW())`,
      [user_id, total.toFixed(2), full_name, email, phone||null, address, notes||null]
    );
    const order_id = orderRes.insertId;

    const values = normalized.flatMap(i=>[
      order_id, i.product_id||null, i.quantity, i.price, i.starter_id||null, i.ring_id||null, i.top_id||null
    ]);
    const placeholders = normalized.map(()=>'(?,?,?,?,?,?,?)').join(',');
    await conn.query(
      `INSERT INTO order_items (order_id,product_id,quantity,price,starter_id,ring_id,top_id)
       VALUES ${placeholders}`, values
    );

    await conn.commit();
    return { order_id, total_price: Number(total.toFixed(2)) };
  } catch (e) { await conn.rollback(); throw e; } finally { conn.release(); }
};

export const getUserOrders = async (user_id) => {
  const [orders] = await pool.query('SELECT * FROM orders WHERE user_id=? ORDER BY created_at DESC',[user_id]);
  return orders;
};
export const getOrderItems = async (order_id) => {
  const [rows] = await pool.query(
    `SELECT oi.*, p.name AS product_name, s.name AS starter_name, r.name AS ring_name, t.name AS top_name
     FROM order_items oi
     LEFT JOIN products p ON p.id=oi.product_id
     LEFT JOIN parts s ON s.id=oi.starter_id
     LEFT JOIN parts r ON r.id=oi.ring_id
     LEFT JOIN parts t ON t.id=oi.top_id
     WHERE oi.order_id=?`, [order_id]);
  return rows;
};

// Update order status
export const updateOrderStatus = async (orderId, status, trackingNumber = null) => {
  const updates = ['status = ?', 'updated_at = CURRENT_TIMESTAMP'];
  const values = [status];
  
  if (status === 'shipped' && trackingNumber) {
    updates.push('tracking_number = ?', 'shipped_at = CURRENT_TIMESTAMP');
    values.push(trackingNumber);
  }
  
  if (status === 'completed') {
    updates.push('delivered_at = CURRENT_TIMESTAMP');
  }
  
  values.push(orderId);
  const [result] = await pool.query(`UPDATE orders SET ${updates.join(', ')} WHERE id = ?`, values);
  return result.affectedRows > 0;
};

// Update payment status
export const updatePaymentStatus = async (orderId, paymentStatus, paymentMethod = null, paymentReference = null) => {
  const [result] = await pool.query(
    'UPDATE orders SET payment_status = ?, payment_method = ?, payment_reference = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [paymentStatus, paymentMethod, paymentReference, orderId]
  );
  return result.affectedRows > 0;
};

// Get order by ID with full details
export const getOrderById = async (orderId) => {
  const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
  if (orders.length === 0) return null;
  
  const order = orders[0];
  const items = await getOrderItems(orderId);
  
  return { ...order, items };
};

// Get all orders with pagination and filtering
export const getAllOrders = async (options = {}) => {
  let query = 'SELECT * FROM orders';
  let countQuery = 'SELECT COUNT(*) as total FROM orders';
  const conditions = [];
  const values = [];
  
  if (options.status) {
    conditions.push('status = ?');
    values.push(options.status);
  }
  
  if (options.payment_status) {
    conditions.push('payment_status = ?');
    values.push(options.payment_status);
  }
  
  if (options.user_id) {
    conditions.push('user_id = ?');
    values.push(options.user_id);
  }
  
  if (conditions.length > 0) {
    const whereClause = ` WHERE ${conditions.join(' AND ')}`;
    query += whereClause;
    countQuery += whereClause;
  }
  
  query += ' ORDER BY created_at DESC';
  
  if (options.limit) {
    const offset = (options.page - 1) * options.limit || 0;
    query += ` LIMIT ${offset}, ${options.limit}`;
  }
  
  const [orders] = await pool.query(query, values);
  const [countResult] = await pool.query(countQuery, values);
  
  return {
    orders,
    total: countResult[0].total,
    page: options.page || 1,
    limit: options.limit || orders.length
  };
};
