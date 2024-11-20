import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const courseSchema = new Schema(
    {
      name: { type: String, required: true },
      description: { type: String },
      duration: { type: Number, required: true }, // e.g., weeks or months
      fee: { type: Number, required: true },
    },
    { timestamps: true }
  );
   const Course = model('Course', courseSchema);

   export default Course