import { getModel } from "../config/llmmodel.js";


export const ppt = async (state) => {
  try {
    const llm = await getModel("ppt")
    const prompt = `You are a professional presentation designer.

Format:

{
  "title":"",
  "subtitle":"",
  "slides":[
    {
      "title":"",
      "points":[
        "",
        "",
        "",
        ""
      ]
    }
  ]
}

Rules:
- Generate exactly 6 content slides.
- Each slide should have 4-6 concise bullet points.
- No markdown.
- No explanation.
- No code block.
- Return ONLY JSON.

Topic:

${state.prompt}
    `

    const res = await llm.invoke(prompt)
    


  } catch (error) {
    
  }
};