
// Middleware to check user roles
export const authorizeRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const userRole = req.user.role.name; // `req.user` contains the authenticated user and their role

      // Check if the user's role is one of the allowed roles
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      }
      console.log("required role", req.user.role.name)
      console.log("auth role", userRole)
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error('Error in role authorization:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
};
