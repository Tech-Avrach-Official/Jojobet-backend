// middlewares/roleCheck.js

const hasRole = (...allowedRoles) => {
    return (req, res, next) => {
      if (!req.isAuthenticated || !req.isAuthenticated()) {
        return res.status(401).json({ message: 'Unauthorized: Please log in' });
      }
  
      const userRole = req.user?.role;
  
      if (allowedRoles.includes(userRole)) {
        return next(); // ✅ Allowed
      }
  
      return res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
    };
  };
  
  module.exports = { hasRole }; 
  