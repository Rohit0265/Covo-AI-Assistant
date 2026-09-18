import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from "dotenv";
import { ChatOpenRouter } from "@langchain/openrouter";

dotenv.config();

export const groq = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "openai/gpt-oss-120b",
});

export const gemini = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-2.5-flash-lite",
});


const openRouter = new ChatOpenRouter({
  model: "deepseek/deepseek-chat",
  temperature: 0,
  maxTokens: 2500,
});


/**
 * Returns the appropriate LLM based on agent type:
 * - coding, ppt, image (imagegen), pdf -> Gemini
 * - chat, search, router, etc. -> Groq
 */
export const getModel = (agent) => {
  switch (agent) {
    case "coding":
      return openRouter;
    case "ppt":
      
    case "image":
    case "pdf":
      return gemini;
    case "chat":
      return groq;
    case "search":
      return groq;
    default:
      return groq;
  }
};