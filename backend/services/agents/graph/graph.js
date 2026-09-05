import { StateGraph } from "@langchain/langgraph";
import { agentState } from "./state";
import { router } from "./router";
import { chat } from "../agents/chat.agent";
import { search } from "../agents/search.agent";
import { ppt } from "../agents/ppt.agent";
import { pdf } from "../agents/pdf.agent";
import { coding } from "../agents/coding.agent";
import { image } from "../agents/image.agent";

const workFlow = new StateGraph(agentState)

workFlow.addNode("router",router)
workFlow.addNode("chat",chat)
workFlow.addNode("search",search)
workFlow.addNode("imageGen",image)
workFlow.addNode("coding",coding)
workFlow.addNode("pdf",pdf)
workFlow.addNode("ppt",ppt)



workFlow.addEdge("__start__","router")
workFlow.addConditionalEdges("router",(state)=>{
    switch (state.agent) {
        case chat:
            return "chat";
        case search:
            return "search";
        case image:
            return "imageGen";
        case coding:
            return "coding";
        case pdf:
            return "pdf";
        case ppt:
            return "ppt";
        default:
            return "chat";
    }
},{
    chat:"chat",
    search:"search",
    coding:"coding",
    pdf:"pdf",
    ppt:"ppt",
    imageGen:"imageGen"

})


workFlow.addEdge("search","chat")
workFlow.addEdge("chat","__end__")
workFlow.addEdge("ppt","__end__")
workFlow.addEdge("pdf","__end__")
workFlow.addEdge("coding","__end__")
workFlow.addEdge("imageGen","__end__")


export const graph = workFlow.compile()