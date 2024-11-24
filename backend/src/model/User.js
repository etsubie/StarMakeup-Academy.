import mongoose from "mongoose";
const { Schema, model } = mongoose;

// Define the base schema for User
const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },

    // Role-specific subdocuments
    manager: {
      type: new Schema(
        {
        
        },
        { _id: false } // No separate _id for this subdocument
      ),
    },

    coordinator: {
      type: new Schema(
        {
          permissions: [{ type: String }], // e.g., ['manage_staff', 'view_feedback']
          appointments: [{ type: Schema.Types.ObjectId, ref: "Appointment" }],
          feedbacks: [{ type: Schema.Types.ObjectId, ref: "Feedback" }],
          chats: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
        },
        { _id: false }
      ),
    },

    registrar: {
      type: new Schema(
        {
          registeredStudents: [{ type: Schema.Types.ObjectId, ref: "Student" }],
          chats: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
        },
        { _id: false }
      ),
    },

    instructor: {
      type: new Schema(
        {
          assignedStudents: [{ type: Schema.Types.ObjectId, ref: "Student" }],
          attendanceRecords: [
            {
              studentId: { type: Schema.Types.ObjectId, ref: "Student" },
              date: { type: Date },
            },
          ],
          chats: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
        },
        { _id: false }
      ),
    },

    client: {
      type: new Schema(
        {
          feedbacks: [{ type: Schema.Types.ObjectId, ref: "Feedback" }],
          appointments: [{ type: Schema.Types.ObjectId, ref: "Appointment" }],
          chats: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
        },
        { _id: false }
      ),
    },

    student: {
      type: new Schema(
        {
          course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
          instructor: { type: Schema.Types.ObjectId, ref: "Instructor", required: true },
          feeStatus: { type: String, enum: ["Paid", "Pending"], default: "Pending" },
          chats: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
        },
        { _id: false }
      ),
    },
  },
  { timestamps: true }
);

// Create the User model
const User = model("User", userSchema);

export default User;
