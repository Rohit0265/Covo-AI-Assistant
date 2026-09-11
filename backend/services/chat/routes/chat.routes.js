import express from "express";
import { createConversation, getConversations, getMessages, saveMessages, updateConversations, deleteConversation } from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/create-conversation", createConversation);
router.get("/get-conversations", getConversations);
router.post("/save-message", saveMessages);
router.get("/get-messages/:conversationId", getMessages);
router.post("/update-conversation", updateConversations);
router.delete("/delete-conversation/:id", deleteConversation);

export default router;