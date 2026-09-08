import { getModel } from "../config/llmmodel.js";

const systemPrompt = "You are CortexAI, an intelligent, helpful, and friendly AI assistant. Assist the user with informative, precise, and polite answers.";

export const chat = async (state) => {
  const llm = getModel("chat");
  const response = await llm.invoke([
    {
      role: "system",
      content: systemPrompt
    },
    {
      role: "human",
      content: state.prompt
    }
  ]);
  return {
    ...state,
    aiResponse: response.content
  };
};