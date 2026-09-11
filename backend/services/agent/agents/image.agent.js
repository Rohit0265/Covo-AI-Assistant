import { getModel } from "../config/llmmodel.js";

const systemPrompt = "You are an expert prompt engineer. The user wants an image. Write a detailed description of the image to pass to an image generator.";

export const image = async (state) => {
  const llm = getModel("gemini");
  const response = await llm.invoke([
    { role: "system", content: systemPrompt },
    { role: "human", content: state.prompt }
  ]);
  return { ...state, aiResponse: response.content };
};