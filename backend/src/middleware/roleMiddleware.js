import Role from "../model/Role.js";

// Middleware to check user role
export const authorizeRole = (roleName) => {
  return async (req, res, next) => {
    try {
      const userRole = await Role.findOne({ name: roleName });

      if (!userRole) {
        return res.status(404).json({ message: 'Role not found' });
      }
console.log("rqr role", req.user.role.name)
console.log("user", userRole.name)
      // Check if user has the required role
      if (req.user.role.name !== userRole.name) {
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      }

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error('Error in role authorization:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
};
