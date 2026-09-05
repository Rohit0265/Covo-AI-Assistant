import express from "express"
import { createConversation, getConversations, getMessages, saveMessages, updateConversations } from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/create-conversation",createConversation)
router.get("get-conversation",getConversations)
router.post("save-message",saveMessages);
router.get("get-messages/:conversationId",getMessages)
router.post("/update-conversation",updateConversations)

export default router;