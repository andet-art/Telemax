const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again in 15 minutes.',
    retryAfter: 15 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.ip; // Use IP address as key
  }
});

// Rate limiting for general API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
    retryAfter: 15 * 60
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiting for contact form
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 contact form submissions per hour
  message: {
    success: false,
    message: 'Too many contact form submissions. Please try again in an hour.',
    retryAfter: 60 * 60
  },
  keyGenerator: (req) => {
    return req.body.email || req.ip; // Use email or IP as key
  }
});

// Password reset rate limiting
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 password reset requests per hour per email
  message: {
    success: false,
    message: 'Too many password reset requests. Please try again in an hour.',
    retryAfter: 60 * 60
  },
  keyGenerator: (req) => {
    return req.body.email || req.ip;
  }
});

// Security headers configuration
const securityHeaders = helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// CORS configuration for mobile app
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:19006', // Expo web
      'exp://localhost:19000', // Expo client
      process.env.CLIENT_URL
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// IP whitelist for admin functions (optional)
const adminIPWhitelist = (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    return next(); // Skip in development
  }
  
  const allowedIPs = (process.env.ADMIN_IPS || '').split(',');
  const clientIP = req.ip || req.connection.remoteAddress;
  
  if (allowedIPs.length > 0 && !allowedIPs.includes(clientIP)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied from this IP address'
    });
  }
  
  next();
};

// Request sanitization
const sanitizeRequest = (req, res, next) => {
  // Remove potentially dangerous characters
  const sanitize = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key].replace(/[<>]/g, ''); // Remove HTML tags
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitize(obj[key]);
      }
    }
  };
  
  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);
  
  next();
};

module.exports = {
  authLimiter,
  apiLimiter,
  contactLimiter,
  passwordResetLimiter,
  securityHeaders,
  corsOptions,
  adminIPWhitelist,
  sanitizeRequest
};