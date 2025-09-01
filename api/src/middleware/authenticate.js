// src/middleware/authenticate.js
import jwt from 'jsonwebtoken';

export default function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user (id + role, etc.) to request
    req.user = decoded;

    next();
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    return res.status(403).json({ error: 'Invalid token' });
  }
}

