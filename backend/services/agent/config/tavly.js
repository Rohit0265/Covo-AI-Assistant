import { TavilySearch } from "@langchain/tavily";

 export const tool = new TavilySearch({
    maxResults: 5,
    topic:"general",
    includeImages: true,
  })