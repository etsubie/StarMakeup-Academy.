import express from 'express';
import verifyToken from '../middleware/authMiddleware.js';
import { authorizeRole } from '../middleware/roleMiddleware.js';
import { createUser, deleteUser, getUser, getUsers, updateUser } from '../controller/userController.js';


const userRoute = express.Router();

// Route to create a new User
userRoute.post(
  '/',
  verifyToken,
  authorizeRole('Manager'),
  createUser
);

// Route to get all Users
userRoute.get(
  '/',
  verifyToken,
  authorizeRole('Manager'),
  getUsers
);
userRoute.get(
  '/:id',
  verifyToken,
  authorizeRole('Manager'),
  getUser
);

// Route to update a User
userRoute.patch(
  '/:id',
  verifyToken,
  // authorizeRole('Manager'),
  updateUser
);

// Route to delete a User
userRoute.delete(
  '/:id',
  verifyToken,
  // authorizeRole('Manager'),
  deleteUser
);

export default userRoute;
