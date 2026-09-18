import { image } from "./agents/image.agent.js";
import dotenv from "dotenv";
dotenv.config();

console.log("GOOGLE_API_KEY:", process.env.GOOGLE_API_KEY);

async function run() {
  const state = { prompt: "A futuristic city skyline at night" };
  try {
    const result = await image(state);
    console.log("Result:", result);
  } catch (err) {
    console.error("Test Error:", err);
  }
  process.exit(0);
}
run();
