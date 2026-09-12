import { getModel } from "../config/llmmodel.js";
import { getMessages } from "../utils/getMessages.js";

const systemPrompt = "You are CortexAI, an intelligent, helpful, and friendly AI assistant. Assist the user with informative, precise, and polite answers.";

export const chat = async (state) => {
  const llm = getModel("chat");
  const history = await getMessages(state.conversationId);

  const messages = [
    new SystemMessage(systemPrompt),

  ]
  history.forEach(msg => {
    if (msg.role === "user") {
      messages.push(new HumanMessage(msg.content));
    }else{
      messages.push(new AIMessage(msg.content));
    }

  })

  messages.push(new HumanMessage(state.prompt));
  console.log(messages)

  const response = await llm.invoke([
    {
      role: "system",
      content: systemPrompt
    },
    {
      role: "human",
      content: state.prompt
    }
  ]);
  return {
    ...state,
    aiResponse: response.content
  };
};