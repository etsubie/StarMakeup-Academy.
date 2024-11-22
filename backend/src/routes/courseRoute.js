import express from 'express';
import verifyToken from '../middleware/authMiddleware.js';
import { authorizeRole } from '../middleware/roleMiddleware.js';
import { createCourse, deleteCourse, getCourseById, getCourses, updateCourse } from '../controller/courseController.js';

const courseRoute = express.Router();

// Route to create a new course
courseRoute.post(
  '/',
  verifyToken,
  authorizeRole('Manager', 'Coordinator'),
  createCourse
);

// Route to get all courses
courseRoute.get(
  '/',
  verifyToken,
  authorizeRole('Manager', 'Coordinator'),
  getCourses
);

// Route to get one course
courseRoute.get(
    '/:id',
    verifyToken,
    getCourseById
  );
  
// Route to update a course
courseRoute.patch(
  '/:id',
  verifyToken,
  authorizeRole('Manager', 'Coordinator'),
  updateCourse
);

// Route to delete a course
courseRoute.delete(
  '/:id',
  verifyToken,
  authorizeRole('Manager'),
  deleteCourse
);

export default courseRoute;
