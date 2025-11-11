import { verifyToken } from '../utils/generateToken.js';
import { supabase } from '../config/supabaseClient.js';

/**
 * 🔒 Middleware: Authenticate any user (customer/admin)
 */
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Access token required',
      });
    }

    // Verify JWT
    const decoded = verifyToken(token);

    // ✅ Allow hardcoded admin directly
    if (decoded.email === 'admin@lalithamegamall.com') {
      req.user = {
        id: decoded.id || 'admin001',
        email: decoded.email,
        name: decoded.name || 'Admin',
        role: 'admin',
      };
      return next();
    }

    // ✅ For normal users — verify from Supabase DB
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, role, created_at')
      .eq('id', decoded.id)
      .single();

    if (error || !user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token or user not found',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('❌ Authentication error:', error.message);
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token',
    });
  }
};

/**
 * 🔐 Middleware: Require admin privileges
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'Authentication required',
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      status: 'error',
      message: 'Admin access required',
    });
  }

  next();
};

/**
 * 🟢 Optional Auth (for routes that don’t require login)
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = verifyToken(token);

      if (decoded.email === 'admin@lalithamegamall.com') {
        req.user = {
          id: decoded.id || 'admin001',
          email: decoded.email,
          name: decoded.name || 'Admin',
          role: 'admin',
        };
        return next();
      }

      const { data: user, error } = await supabase
        .from('users')
        .select('id, email, name, role, created_at')
        .eq('id', decoded.id)
        .single();

      if (!error && user) {
        req.user = user;
      }
    }

    next();
  } catch {
    // Continue without authentication
    next();
  }
};

export default authenticateToken;
