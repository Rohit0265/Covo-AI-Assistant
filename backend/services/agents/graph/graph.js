import { StateGraph } from "@langchain/langgraph";
import { agentState } from "./state";

const graph = new StateGraph(agentState)