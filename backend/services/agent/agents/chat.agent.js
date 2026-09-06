import { getModel } from "../config/llmmodel"

export const chat =async (state)=>{
    const llm = getModel("chat")
    const prompt = "say hello"
    const response= await llm.invoke([
        {
            "role":"system",
            "content":systemPrompt
        },
        {
            "role":"human",
            "content":state.prompt
        }
    ])
    return {
        ...state,
        aiResponse:response.content
    }
}