import fsp from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Prefer env; fallback to ./outbox
const OUTBOX = process.env.MAILER_OUTBOX || path.join(__dirname, '../../outbox');

async function ensureOutbox() {
  try { await fsp.mkdir(OUTBOX, { recursive: true }); } catch {}
}

export async function sendEmail({ to, subject, text, html, meta = {} }) {
  await ensureOutbox();
  const ts = new Date().toISOString().replace(/[:.]/g,'-');
  const safeTo = String(to).replace(/[^a-zA-Z0-9@._-]/g,'_');
  const file = path.join(OUTBOX, `${ts}__${safeTo}.json`);
  const payload = { to, subject, text, html, meta, at: new Date().toISOString() };
  await fsp.writeFile(file, JSON.stringify(payload, null, 2), 'utf8');
  if (process.env.NODE_ENV !== 'test') {
    console.log(`[mailer] FILE mode active. Outbox: ${OUTBOX}`);
  }
  return { ok: true, file };
}

export async function sendOrderStatusEmail({ to, orderId, status, meta = {} }) {
  const subject = `Your order #${orderId} status: ${status}`;
  const text = `Hello,\n\nYour order #${orderId} is now "${status}".\n\nThanks!`;
  const html = `<p>Hello,</p><p>Your order <b>#${orderId}</b> is now "<b>${status}</b>".</p><p>Thanks!</p>`;
  return sendEmail({ to, subject, text, html, meta: { ...meta, kind: 'order-status', orderId, status } });
}

export async function sendTrackingEmail({ to, orderId, trackingNumber, meta = {} }) {
  const subject = `Tracking for order #${orderId}`;
  const text = `Hello,\n\nTracking number for order #${orderId}: ${trackingNumber}\n\nThanks!`;
  const html = `<p>Hello,</p><p>Tracking number for order <b>#${orderId}</b>: <b>${trackingNumber}</b></p><p>Thanks!</p>`;
  return sendEmail({ to, subject, text, html, meta: { ...meta, kind: 'tracking', orderId, trackingNumber } });
}
