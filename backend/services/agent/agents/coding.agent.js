import { getModel } from "../config/llmmodel.js";

const systemPrompt = "You are an expert software developer. Provide clean, efficient, and well-commented code solutions.";

export const coding = async (state) => {
  const llm = getModel("gemini");
  const response = await llm.invoke([
    { role: "system", content: systemPrompt },
    { role: "human", content: state.prompt }
  ]);
  return { ...state, aiResponse: response.content };
};