import { Student } from "../model/User.js";

export const removeStudentData = async(studentId) => {
  try {
    // Find the student document
    const student = await Student.findById(studentId);

    if (!student) {
      console.log("Student not found");
      return;
    }

    // Remove student-specific fields
    await Student.updateOne(
      { _id: studentId },
      {
        $unset: {
          attendance: "",
        //   feeStatus: "",
          chats: "",
        },
        $set: { role: 'Client' }, // Clear the role or assign a generic role
      }
    );

    console.log("Student-specific data removed but user retained.");
  } catch (err) {
    console.error("Error removing student data:", err);
  }
}
