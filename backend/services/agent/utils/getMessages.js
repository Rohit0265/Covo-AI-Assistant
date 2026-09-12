import axios from "axios";

export const getMessages = async (conversationId) => {
  if (!conversationId) return [];
  try {
    const { data } = await axios.get(`${process.env.CHAT_SERVICE_URL}/get-messages/${conversationId}`);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching messages:", error.message || error);
    return [];
  }
};