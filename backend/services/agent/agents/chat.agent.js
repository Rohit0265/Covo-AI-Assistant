import { getModel } from "../config/llmmodel.js";
import { getMessages } from "../utils/getMessages.js";
import { SystemMessage, HumanMessage, AIMessage } from "@langchain/core/messages";

export const chat = async (state) => {
  const llm = getModel("chat");
  const history = await getMessages(state.conversationId);

  const searchContext = state.searchResults
    ? `Web Search Results: ${JSON.stringify(state.searchResults)}. Answer the user using the above search results.`
    : "";

  const systemPrompt = `You are CortexAI, an intelligent, helpful, and friendly AI assistant. ${searchContext} Assist the user with informative, precise, and polite answers.`;

  const messages = [
    new SystemMessage(systemPrompt),
  ];

  if (Array.isArray(history)) {
    history.forEach(msg => {
      if (msg.role === "user") {
        messages.push(new HumanMessage(msg.content));
      } else {
        messages.push(new AIMessage(msg.content));
      }
    });
  }

  messages.push(new HumanMessage(state.prompt));

  const response = await llm.invoke(messages);

  return {
    ...state,
    aiResponse: response.content
  };
};