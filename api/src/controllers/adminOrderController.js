import db from "../config/db.js";

// Fetch all orders with items + user info
export const getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.id, o.name, o.email, o.phone, o.address, o.total_price, o.status,
              o.created_at, u.email AS user_email
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC`
    );

    // Fetch items for each order
    for (const order of orders) {
      const [items] = await db.query(
        `SELECT oi.*, p.name AS product_name
         FROM order_items oi
         LEFT JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    res.json({ orders });
  } catch (err) {
    console.error("❌ Error fetching admin orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await db.query(`UPDATE orders SET status = ? WHERE id = ?`, [status, id]);
    res.json({ ok: true });
  } catch (err) {
    console.error("❌ Error updating order status:", err);
    res.status(500).json({ error: "Failed to update order status" });
  }
};
