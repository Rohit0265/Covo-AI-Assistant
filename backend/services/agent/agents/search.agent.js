import { getModel } from "../config/llmmodel.js";

const systemPrompt = "You are an intelligent search assistant. Provide concise, accurate, and direct answers to the user's queries.";

export const search = async (state) => {
  const llm = getModel("groq");
  const response = await llm.invoke([
    { role: "system", content: systemPrompt },
    { role: "human", content: state.prompt }
  ]);
  // The graph routes search -> chat, so we pass the output forward
  return { ...state, prompt: `Search Result: ${response.content}\nUser Request: ${state.prompt}` };
};