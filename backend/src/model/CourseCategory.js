import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const courseCategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }], // Array of course IDs
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Created by a user
  },
  { timestamps: true }
);

export const CourseCategory = model('CourseCategory', courseCategorySchema);
