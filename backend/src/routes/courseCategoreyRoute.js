import express from 'express';
import verifyToken from '../middleware/authMiddleware.js';
import { createCourseCategory, deleteCourseCategory, getAllCategories, updateCourseCategory } from '../controller/courseCategorycontroller.js';
import { authorizeRole } from '../middleware/roleMiddleware.js';

const courseCategoreyRoute = express.Router();

// Route to create a new Permission
courseCategoreyRoute.post(
  '/',
  verifyToken,
  authorizeRole('Manager'),
  createCourseCategory
);

// Route to get all Permissions
courseCategoreyRoute.get(
  '/',
  verifyToken,
  authorizeRole('Manager'),
  getAllCategories
);

// Route to update a Permission
courseCategoreyRoute.patch(
  '/:id',
  verifyToken,
  authorizeRole('Manager'),
  updateCourseCategory
);

// Route to delete a Permission
courseCategoreyRoute.delete(
  '/:id',
  verifyToken,
  authorizeRole('Manager'),
  deleteCourseCategory
);

export default courseCategoreyRoute;
