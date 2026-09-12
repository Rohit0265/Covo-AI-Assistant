import { TavilySearch } from "@langchain/tavily";
import { getModel } from "../config/llmmodel.js";

export const search = async (state) => {
  const apiKey = process.env.TAVILY_API_KEY;

  if (apiKey) {
    try {
      const tavily = new TavilySearch({ tavilyApiKey: apiKey });
      const searchOutput = await tavily.invoke(state.prompt);
      const searchContent = typeof searchOutput === "string" ? searchOutput : JSON.stringify(searchOutput);

      return {
        ...state,
        prompt: `Web Search Context (Tavily):\n${searchContent}\n\nUser Question: ${state.prompt}`
      };
    } catch (error) {
      console.error("Tavily search error:", error.message || error);
    }
  }
}
