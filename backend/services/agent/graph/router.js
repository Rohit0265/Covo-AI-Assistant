import { getModel } from "../config/llmmodel.js";

export const router = async(state)=>{
    const llm = getModel("router")

    const prompt = `You are an AI Agent Router.

Analyze the user's input and select the SINGLE most appropriate agent to handle the request.

Available agents:

chat
search
ppt
pdf
imageGen
coding

ROUTING RULES:

chat:
Use for general conversation, explanations, writing, rewriting, summaries, brainstorming, translation, advice, reasoning, and questions that do not require current internet information or specialized tools.

search:
Use when the user needs current, real-time, latest, updated, or internet-based information. Also use when the user explicitly asks to search, find, browse, look up, or provide links.

ppt:
Use when the user wants to create a PowerPoint, presentation, slides, pitch deck, or PPT.

pdf:
Use when the user wants to create, read, edit, analyze, extract information from, or convert something into a PDF.

imageGen:
Use when the user wants to generate, create, draw, design, visualize, edit, or transform an image.

coding:
Use when the user wants to write, debug, explain, review, optimize, or develop code, software, websites, APIs, databases, algorithms, or programming projects.

IMPORTANT RULES:

* Select ONLY ONE agent.
* Select the agent that best represents the user's PRIMARY intent.
* Do not select multiple agents.
* Do not explain your decision.
* Do not answer the user's request.
* Do not use punctuation.
* Do not use JSON.
* Do not use Markdown.
* Your entire response must contain ONLY ONE of these exact words:

chat
search
ppt
pdf
imageGen
coding


user Query: ${state.prompt}
`


const response = await llm.invoke(prompt)


return {
    ...state,
    agent:response.content.trim().toLowerCase()
}



}