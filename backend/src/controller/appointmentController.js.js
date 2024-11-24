import Appointment from "../model/Appointment.js";

// Get all appointments (for coordinator or manager views)
export const getAllAppointments = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const skip = (pageNumber - 1) * limitNumber;

  try {
    const appointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    const totalAppointments = await Appointment.countDocuments();

    res.status(200).json({
      success: true,
      data: appointments,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(totalAppointments / limitNumber),
        totalAppointments,
        limitNumber,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get appointments for the current user
export const getAppointments = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const skip = (pageNumber - 1) * limitNumber;

  try {
    const appointments = await Appointment.find({ customerId: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    const totalAppointments = await Appointment.countDocuments({
      customerId: req.user.id,
    });

    res.status(200).json({
      success: true,
      data: appointments,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(totalAppointments / limitNumber),
        totalAppointments,
        limitNumber,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const createAppointment = async (req, res) => {
  try {
    const { service, date, time, phone, customer_name } = req.body;

    // Validate required fields
    if (!service || !date || !time || !phone || !customer_name) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    // Ensure `req.user` contains authenticated user data
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized. Please log in." });
    }

    // Create a new appointment
    const newAppointment = new Appointment({
      customer_name,
      customerId: req.user.id, 
      phone,
      service,
      date,
      time,
    });

    // Save the appointment to the database
    await newAppointment.save();

    res.status(201).json({
      success: true,
      message: "Appointment created successfully.",
      data: newAppointment,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create appointment. Please try again later.",
      error: error.message,
    });
  }
};

// Confirm an appointment
export const confirmAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status: "Confirmed" },
      { new: true }
    );

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found." });
    }

    res.status(200).json({
      success: true,
      message: "Appointment confirmed.",
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel an appointment (for both admin and user)
export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the appointment
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found." });
    }

    // Role-based authorization
    if (req.user.role.name === "Customer") {
      // Customers can only delete their own appointments
      if (appointment.customerId.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized. You can only cancel your own appointments.",
        });
      }

      // Delete the appointment
      await Appointment.findByIdAndDelete(id);
      return res.status(200).json({ success: true, message: "Appointment deleted successfully." });
    } else {
      // Other roles can only mark appointments as "Cancelled"
      appointment.status = "Cancelled";
      await appointment.save();

      return res.status(200).json({
        success: true,
        message: "Appointment status updated to 'Cancelled'.",
        data: appointment,
      });
    }
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update an appointment
export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { service, date, time } = req.body;

    const appointment =
      req.user.role.name === "Customer"
        ? await Appointment.findOneAndUpdate(
            { _id: id, customerId: req.user.id },
            { service, date, time },
            { new: true }
          )
        : await Appointment.findByIdAndUpdate(
            id,
            { service, date, time },
            { new: true }
          );
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found." });
    }

    res.status(200).json({
      success: true,
      message: "Appointment updated.",
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
