import { getModel } from "../config/llmmodel.js";

const systemPrompt = "You are an expert document assistant. Format your response beautifully for reading or summarize the requested information comprehensively.";

export const pdf = async (state) => {
  const llm = getModel("gemini");
  const response = await llm.invoke([
    { role: "system", content: systemPrompt },
    { role: "human", content: state.prompt }
  ]);
  return { ...state, aiResponse: response.content };
};