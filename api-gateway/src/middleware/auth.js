const jwt = require('jsonwebtoken');

const authenticateToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  
  const token = authHeader.split(' ')[1];
  if (!token) return null;
  
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error('Token verification error:', error.message);
    return null;
  }
};

const requireAuth = (resolver) => {
  return (parent, args, context, info) => {
    if (!context.user) {
      throw new Error('Authentication required');
    }
    return resolver(parent, args, context, info);
  };
};

const requireRole = (role) => {
  return (resolver) => {
    return (parent, args, context, info) => {
      if (!context.user) {
        throw new Error('Authentication required');
      }
      if (context.user.role !== role) {
        throw new Error(`Role ${role} required`);
      }
      return resolver(parent, args, context, info);
    };
  };
};

module.exports = { authenticateToken, requireAuth, requireRole };