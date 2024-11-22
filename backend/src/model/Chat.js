import mongoose from 'mongoose';
const { Schema, model } = mongoose;

// Message Schema ( for separation of concerns)
const messageSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    readBy: [{ type: Schema.Types.ObjectId, ref: "User" }] // Track who has read the message
}, { timestamps: true });

const Message = model("Message", messageSchema);

// Chat Schema
const chatSchema = new Schema(
    {
        participants: [
            { type: Schema.Types.ObjectId, ref: "User", required: true },
        ],
        messages: [messageSchema], // Use the separate Message schema
        lastUpdated: { type: Date, default: Date.now },
        lastMessage: { type: Schema.Types.ObjectId, ref: "Message" }, // Reference to the last message
        name: { type: String }, // Optional: Name of the group chat
        isGroup: { type: Boolean, default: false }, // Indicates whether it's a group chat
    },
    { timestamps: true }
);

const Chat = model("Chat", chatSchema);

export default Chat;