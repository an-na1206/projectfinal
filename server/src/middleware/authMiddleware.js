import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes: verify JWT Bearer token
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret_jwt_key_edupulse_2026');

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User no longer exists. Authorization denied.'
        });
      }
      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token verification failed or token has expired.'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authorization token provided.'
    });
  }
};

// Admin only access
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Forbidden. Admin privileges required for this action.'
  });
};

// Optional auth: attaches user if token is present, does not block if absent
export const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret_jwt_key_edupulse_2026');
      req.user = await User.findById(decoded.id).select('-password');
    } catch (e) {
      req.user = null;
    }
  }
  next();
};
