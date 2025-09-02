import { sendEmail } from '../lib/mailer.js';

const line = (s='') => s.replace(/\s+/g, ' ').trim();

export async function notifyOrderConfirmation(order, items=[]) {
  if (!order?.email) return;
  const subject = `Order #${order.id} received`;
  const list = items.map(i => {
    if (i.product_id) return `• Product #${i.product_id} x${i.quantity} @ ${i.price}`;
    return `• Custom set (starter:${i.starter_id}, ring:${i.ring_id}, top:${i.top_id}) x${i.quantity} @ ${i.price}`;
  }).join('\n');

  const text = [
    `Hi ${order.name || 'there'},`,
    '',
    `Thanks for your order #${order.id}.`,
    `Total: $${order.total_price}`,
    '',
    'Items:',
    list,
    '',
    'We will update you when the status changes.',
    '— Telemax'
  ].join('\n');

  const html = `
    <div style="font-family:system-ui,Segoe UI,Arial,sans-serif">
      <h2>Thanks for your order #${order.id}</h2>
      <p>${line(`Hi ${order.name || 'there'},`)} Thank you for shopping with us.</p>
      <p><b>Total:</b> $${order.total_price}</p>
      <p><b>Items:</b></p>
      <ul>
        ${items.map(i => {
          const label = i.product_id
            ? `Product #${i.product_id}`
            : `Custom (starter:${i.starter_id}, ring:${i.ring_id}, top:${i.top_id})`;
          return `<li>${label} &times; ${i.quantity} @ ${i.price}</li>`;
        }).join('')}
      </ul>
      <p>We’ll email you when your order progresses.</p>
      <p>— Telemax</p>
    </div>
  `;
  await sendEmail({ to: order.email, subject, html, text });
}

export async function notifyOrderStatus(order) {
  if (!order?.email) return;
  const subject = `Order #${order.id} update: ${order.status}`;
  const tracking = order.tracking_number ? `\nTracking: ${order.tracking_number}` : '';
  const text = [
    `Hello ${order.name || ''}`.trim() + ',',
    '',
    `Your order #${order.id} status is now "${order.status}".`,
    tracking,
    '',
    'Thank you for choosing Telemax.'
  ].join('\n');

  const html = `
    <div style="font-family:system-ui,Segoe UI,Arial,sans-serif">
      <h3>Order #${order.id} update</h3>
      <p>Status: <b>${order.status}</b></p>
      ${order.tracking_number ? `<p>Tracking: <code>${order.tracking_number}</code></p>` : ''}
      <p>Thanks for choosing Telemax.</p>
    </div>
  `;
  await sendEmail({ to: order.email, subject, html, text });
}
