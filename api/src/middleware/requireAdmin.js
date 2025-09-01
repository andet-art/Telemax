export default function requireAdmin(req, res, next) {
  // DEBUG: remove later
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
}
