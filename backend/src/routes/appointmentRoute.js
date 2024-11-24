import express from "express";
import verifyToken from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";
import {
  cancelAppointment,
  confirmAppointment,
  createAppointment,
  getAllAppointments,
  getAppointments,
  updateAppointment,
} from "../controller/appointmentController.js.js";

const appointmentRoute = express.Router();

// Route to create a new appointment
appointmentRoute.post(
  "/",
  verifyToken,
  authorizeRole("Customer"),
  createAppointment
);

// Route to get all appointments
appointmentRoute.get(
  "/",
  verifyToken,
  authorizeRole("Customer"),
  getAppointments
);

// Route to update a appointment
appointmentRoute.patch(
  "/:id",
  verifyToken,
  authorizeRole("Manager", "Coordinator", "Customer"),
  updateAppointment
);

// Route to delete a appointment
appointmentRoute.delete(
  "/:id",
  verifyToken,
  authorizeRole("Manager", "Coordinator", "Customer"),
  cancelAppointment
);

// Get all appointments
appointmentRoute.get(
  "/all",
  verifyToken,
  authorizeRole("Manager", "Coordinator"),
  getAllAppointments
);

// Confirm an appointment
appointmentRoute.patch(
  "/:id/confirm",
  verifyToken,
  authorizeRole("Manager", "Coordinator"),
  confirmAppointment
);

export default appointmentRoute;
