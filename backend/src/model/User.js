import mongoose from "mongoose";
const { Schema, model } = mongoose;

// Define the base schema for User
const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: [{ type: Schema.Types.ObjectId, ref: Role }],
  },
  { timestamps: true, discriminatorKey: "role" }
);
const User = model("User", userSchema);
export default User;

const managerSchema = new Schema({}, { timestamps: true });
export const Manager = User.discriminator("Manager", managerSchema);

const coordinatorSchema = new Schema(
  {
    permissions: [{ type: String }], // e.g., ['manage_staff', 'view_feedback']
    appointments: [{ type: Schema.Types.ObjectId, ref: "Appointment" }],
    feedbacks: [{ type: Schema.Types.ObjectId, ref: "Feedback" }],
    chats: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
  },
  { timestamps: true }
);
export const Coordinator = User.discriminator("Coordinator", coordinatorSchema);

const registrarSchema = new Schema(
  {
    registeredStudents: [{ type: Schema.Types.ObjectId, ref: "Student" }],
    chats: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
  },
  { timestamps: true }
);
export const Registrar = User.discriminator("Registrar", registrarSchema);

const instructorSchema = new Schema(
  {
    assignedStudents: [{ type: Schema.Types.ObjectId, ref: "Student" }],
    attendanceRecords: [{ type: Object }], // Format: [{ studentId: ObjectId, date: Date }]
    chats: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
  },
  { timestamps: true }
);
export const Instructor = User.discriminator("Instructor", instructorSchema);

const clientSchema = new Schema(
  {
    feedbacks: [{ type: Schema.Types.ObjectId, ref: "Feedback" }],
    appointments: [{ type: Schema.Types.ObjectId, ref: "Appointment" }],
    chats: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
  },

  { timestamps: true }
);
export const Client = User.discriminator("Client", clientSchema);

const studentSchema = new Schema(
  {
  
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "Instructor",
      required: true,
    },
    attendance: [{ date: Date, status: Boolean }], // Format: [{ date: Date, status: true/false }]
    feeStatus: { type: String, enum: ["Paid", "Pending"], default: "Pending" },
    chats: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
  },
  { timestamps: true }
);

export const Student = User.discriminator("Student", studentSchema);
