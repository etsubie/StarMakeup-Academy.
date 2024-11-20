import express from 'express';
import verifyToken from '../middleware/authMiddleware.js';
import { authorizeRole } from '../middleware/roleMiddleware.js';
import { createPermission, deletePermission, getPermissions, updatePermission } from '../controller/permissionController.js';

const permissionRoute = express.Router();

// Route to create a new Permission
permissionRoute.post(
  '/',
  verifyToken,
  authorizeRole('Manager'),
  createPermission
);

// Route to get all Permissions
permissionRoute.get(
  '/',
  verifyToken,
  authorizeRole('Manager'),
  getPermissions
);

// Route to update a Permission
permissionRoute.patch(
  '/:id',
  verifyToken,
  authorizeRole('Manager'),
  updatePermission
);

// Route to delete a Permission
permissionRoute.delete(
  '/:id',
  verifyToken,
  authorizeRole('Manager'),
  deletePermission
);

export default permissionRoute;
