import mongoose from "mongoose";
const { Schema, model } = mongoose;

const feedbackSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);
const Feedback = model("Feedback", feedbackSchema);

export default Feedback;
