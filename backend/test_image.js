import { image } from "./services/agent/agents/image.agent.js";
import dotenv from "dotenv";
dotenv.config();

async function run() {
  const state = { prompt: "A futuristic city skyline at night" };
  const result = await image(state);
  console.log("Result:", result);
}
run();
