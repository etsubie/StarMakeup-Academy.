import express from 'express';
import { createRole, deleteRole, getAllRoles, getRole, updateRole } from '../controller/roleController.js';
import verifyToken from '../middleware/authMiddleware.js';
import { authorizeRole } from '../middleware/roleMiddleware.js';

const roleRoute = express.Router();

// Route to create a new Role
roleRoute.post(
  '/',
  verifyToken,
  authorizeRole('Manager'),
  createRole
);

// Route to get all Roles
roleRoute.get(
  '/',
  verifyToken,
  authorizeRole('Manager'),
  getAllRoles
);
// Route to update a Role
roleRoute.get(
  '/:id',
  verifyToken,
  authorizeRole('Manager'),
  getRole
);
// Route to update a Role
roleRoute.patch(
  '/:id',
  verifyToken,
  authorizeRole('Manager'),
  updateRole
);

// Route to delete a Role
roleRoute.delete(
  '/:id',
  verifyToken,
  authorizeRole('Manager'),
  deleteRole
);

export default roleRoute;
