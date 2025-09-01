const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

// Verify JWT Token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const [rows] = await pool.execute(
      'SELECT id, email, first_name, last_name, role, age_verified, terms_accepted FROM users WHERE id = ? AND updated_at IS NOT NULL',
      [decoded.userId]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token - user not found'
      });
    }

    // Attach user to request
    req.user = {
      id: rows[0].id,
      email: rows[0].email,
      firstName: rows[0].first_name,
      lastName: rows[0].last_name,
      role: rows[0].role,
      ageVerified: rows[0].age_verified,
      termsAccepted: rows[0].terms_accepted
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

// Check if user verified age (for tobacco products)
const requireAgeVerification = (req, res, next) => {
  if (!req.user.ageVerified) {
    return res.status(403).json({
      success: false,
      message: 'Age verification required for tobacco products',
      code: 'AGE_VERIFICATION_REQUIRED'
    });
  }
  next();
};

// Check if user accepted terms
const requireTermsAccepted = (req, res, next) => {
  if (!req.user.termsAccepted) {
    return res.status(403).json({
      success: false,
      message: 'Terms and conditions must be accepted',
      code: 'TERMS_NOT_ACCEPTED'
    });
  }
  next();
};

// Generate JWT tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId, type: 'access' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  );

  return { accessToken, refreshToken };
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireAgeVerification,
  requireTermsAccepted,
  generateTokens
};