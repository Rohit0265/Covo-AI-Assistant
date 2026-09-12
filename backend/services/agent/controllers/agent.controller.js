import axios from "axios";
import { graph } from "../graph/graph.js";
import { addMessages } from "@langchain/langgraph";

export const agent = async (req, res) => {
  try {
    const { prompt, conversationId } = req.body;
    const chatServiceUrl = process.env.CHAT_SERVICE_URL || "http://localhost:8002";

    await addMessages(conversationId, "user", prompt);

    // 1. Save user message to chat service
    if (conversationId) {
      try {
        await axios.post(`${chatServiceUrl}/save-message`, {
          conversationId,
          role: "user",
          content: prompt
        });
      } catch (err) {
        console.error("Error saving user message to chat service:", err.message);
      }
    }

    // 2. Invoke the agent graph
    const result = await graph.invoke({
      prompt,
      conversationId
    });

    const responseText = result.aiResponse || "I'm CortexAI. How can I help you today?";

    // 3. Save assistant message to chat service
    if (conversationId) {
      try {
        await addMessages(conversationId, "assistant", response);
        await axios.post(`${chatServiceUrl}/save-message`, {
          conversationId,
          role: "assistant",
          content: responseText
        });
      } catch (err) {
        console.error("Error saving assistant message to chat service:", err.message);
      }
    }

    return res.status(200).json({ response: responseText });
  } catch (error) {
    console.error("Agent execution error:", error);
    return res.status(500).json({ message: `Agent error: ${error.message || error}` });
  }
};