import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from "dotenv";
dotenv.config();

export const groq = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "openai/gpt-oss-120b",
});

export const gemini = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-2.5-flash-lite",
});

/**
 * Returns the appropriate LLM based on agent type:
 * - coding, ppt, image (imagegen), pdf -> Gemini
 * - chat, search, router, etc. -> Groq
 */
export const getModel = (agentOrModelName = "chat") => {
  const geminiAgents = ["coding", "ppt", "image", "imagegen", "pdf", "gemini"];
  const name = String(agentOrModelName || "").toLowerCase();

  if (geminiAgents.includes(name)) {
    return gemini;
  }

  return groq;
};