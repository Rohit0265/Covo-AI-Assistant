import mongoose from "mongoose";

const filesSchema = new mongoose.Schema({
  name: String,
  content: String
}, {
  _id: false
});

const artifactSchema = new mongoose.Schema({
  id: Number,
  type:String,
  title: String,
  files:[filesSchema]
}, {
  _id: false
});

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
  images: [String],
  artifacts: [artifactSchema]
}, {
  timestamps: true
});

const Message = mongoose.model("Message", messageSchema);
export default Message;