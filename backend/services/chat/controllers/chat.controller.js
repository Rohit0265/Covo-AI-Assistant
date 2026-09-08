import Message from "../model/message.model.js";
import Conversation from "../model/conversation.models.js";

export const createConversation = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    console.log("userId", userId);
    const newConversation = await Conversation.create({
      userId: userId
    });
    return res.status(200).json(newConversation);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    console.log("userId", userId);
    const conversations = await Conversation.find({
      userId: userId
    }).sort({ updatedAt: -1 });
    return res.status(200).json(conversations);
  } catch (error) {
    return res.status(500).json({ error: `get conversations error ${error}` });
  }
};

export const updateConversations = async (req, res) => {
  try {
    const { id, title } = req.body;
    const updated = await Conversation.findByIdAndUpdate(id, { title }, { new: true });
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ error: `update conversation error ${error}` });
  }
};

export const saveMessages = async (req, res) => {
  try {
    const { conversationId, role, content } = req.body;
    const message = await Message.create({
      conversationId,
      content,
      role
    });
    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json({ error: `error in saving message ${error}` });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    }).sort({ updatedAt: 1 });
    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ error: `error in finding message ${error}` });
  }
};