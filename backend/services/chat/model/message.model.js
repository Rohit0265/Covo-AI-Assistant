import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: String,
    required: true,
    index: true
  },
  role: {
    type: String,
    enum: ["user", "assistant", "assisstant"]
  },
  content: String,
  images: [String]
}, {
  timestamps: true
});

const Message = mongoose.model("Message", messageSchema);
export default Message;