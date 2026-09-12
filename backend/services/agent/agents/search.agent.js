import { getSearchTool } from "../config/tavly.js";

export const search = async (state) => {
  try {
    const searchTool = getSearchTool();
    const results = await searchTool.invoke({ query: state.prompt });
    console.log("Tavily Search Results:", results);

    const searchContent = typeof results === "string" ? results : JSON.stringify(results);
    const images = (results && typeof results === "object" && Array.isArray(results.images)) ? results.images : [];

    return {
      ...state,
      prompt: `Web Search Context (Tavily):\n${searchContent}\n\nUser Question: ${state.prompt}`,
      searchResults: results || [],
      images: images
    };
  } catch (error) {
    console.error("Tavily search agent error:", error.message || error);
    return {
      ...state,
      searchResults: [],
      images: []
    };
  }
};