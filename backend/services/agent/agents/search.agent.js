import { getSearchTool } from "../config/tavly.js";

export const search = async (state) => {
  try {
    const searchTool = getSearchTool();
    const rawResults = await searchTool.invoke({ query: state.prompt });

    let searchSnippets = "";
    let images = [];

    if (rawResults && typeof rawResults === "object") {
      if (rawResults.answer) {
        searchSnippets += `Tavily Direct Answer: ${rawResults.answer}\n\n`;
      }
      if (Array.isArray(rawResults.images)) {
        images = rawResults.images;
      }
      if (Array.isArray(rawResults.results)) {
        searchSnippets += rawResults.results
          .map((r) => `Title: ${r.title}\nContent: ${r.content}\nSource: ${r.url}`)
          .join("\n\n");
      }
    }

    if (!searchSnippets) {
      searchSnippets = typeof rawResults === "string" ? rawResults : JSON.stringify(rawResults);
    }

    return {
      ...state,
      searchContext: searchSnippets,
      searchResults: rawResults || [],
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