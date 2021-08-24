import mongoose from "mongoose";

// ---------------------- conversation schema ----------------------
const ConversationSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
      required: [true, "Members needed."],
    },
    lastMsg: String,
  },
  { timestamps: true }
);

// ---------------------- messages schema -------------------
const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      required: [true, "Conversation id required."],
    },
    senderId: {
      type: String,
      required: [true, "Sender id required."],
    },
    text: {
      type: String,
      required: [true, "Message body required."],
    },
  },
  { timestamps: true }
);

// exports
export const Conversations = mongoose.model("Conversation", ConversationSchema);
export const Messages = mongoose.model("Message", MessageSchema);
