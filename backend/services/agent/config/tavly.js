import { TavilySearch } from "@langchain/tavily";
import dotenv from "dotenv";
dotenv.config();

export const getSearchTool = () => {
  return new TavilySearch({
    tavilyApiKey: process.env.TAVILY_API_KEY,
    maxResults: 5,
    topic: "general",
    includeImages: true,
  });
};

export default getSearchTool;