import { getModel } from "../config/llmmodel.js";

const systemPrompt = "You are a presentation expert. Provide a structured slide-by-slide outline for the presentation requested by the user.";

export const ppt = async (state) => {
  const llm = getModel("gemini");
  const response = await llm.invoke([
    { role: "system", content: systemPrompt },
    { role: "human", content: state.prompt }
  ]);
  return { ...state, aiResponse: response.content };
};