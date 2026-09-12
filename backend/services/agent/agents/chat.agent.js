import { getModel } from "../config/llmmodel.js";
import { getMessages } from "../utils/getMessages.js";
import { SystemMessage, HumanMessage, AIMessage } from "@langchain/core/messages";

export const chat = async (state) => {
  const llm = getModel("chat");
  const history = await getMessages(state.conversationId);

  const currentTimeStr = new Date().toUTCString();

  let systemPrompt = `You are CortexAI, an intelligent, helpful, and friendly AI assistant. Current System Time (UTC): ${currentTimeStr}. Assist the user with informative, precise, and polite answers.`;

  if (state.searchContext) {
    systemPrompt = `You are CortexAI, an intelligent web search assistant.
Current System Time Reference: ${currentTimeStr}

LIVE WEB SEARCH CONTEXT:
${state.searchContext}

INSTRUCTIONS:
1. Use the live web search context and system time above to answer the user's question directly, accurately, and with up-to-date information.
2. If asked for the current time, date, weather, or real-time facts, state the exact answer clearly without saying you cannot check real-time data.`;
  }

  const messages = [
    new SystemMessage(systemPrompt),
  ];

  if (Array.isArray(history)) {
    history.forEach((msg) => {
      if (msg && msg.content) {
        if (msg.role === "user") {
          messages.push(new HumanMessage(msg.content));
        } else {
          messages.push(new AIMessage(msg.content));
        }
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