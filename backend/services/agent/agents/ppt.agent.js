import { getModel } from "../config/llmmodel.js";
import generatePPT from "../utils/generatePPT.js";
import { getFiles } from "../utils/getFroms3.js";
import { uploadToS3 } from "../utils/uploadToS3.js";


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
    const data = JSON.parse(res.content)
    const ppt = generatePPT(data)
    const buffer = await ppt.write({
      outputType:"nodebuffer"
    })

    const filename = `ppt-${Date.now()}.pptx`
    await uploadToS3(buffer,filename,"application/vnd.openxmlformats-officedocument.presentationml.presentation")

    const downloadUrl = await getFiles(filename,24*60*60)

    return {
      ...state,
      aiResponse: `## ✅ Presentation Generated

**${data.title}**

📥 [Download PPT](${downloadUrl})

*Link expires in 10 minutes.*`
    }

  } catch (error) {
    console.log(error)
    return {
      ...state,aiResponse:"Failed to generate ppt"
    }
  }
};