import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const courseSchema = new Schema(
  {
    image: { type: String }, // Path to the uploaded image
    name: { type: String, required: true },
    description: { type: String },
    duration: { type: Number, required: true }, // e.g., weeks or months
    fee: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Course = model('Course', courseSchema);
