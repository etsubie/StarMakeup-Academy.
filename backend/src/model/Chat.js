import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const chatSchema = new Schema(
  {
    participants: [
      { type: Schema.Types.ObjectId, ref: "User", required: true },
    ],
    messages: [
      {
        sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    lastUpdated: { type: Date, default: Date.now },
    name: { type: String }, // Optional: Name of the group chat
    isGroup: { type: Boolean, default: false }, // Indicates whether it's a group chat
  },
  { timestamps: true }
);

const Chat = model("Chat", chatSchema);

export default Chat;
