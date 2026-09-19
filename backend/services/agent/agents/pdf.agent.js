import { getModel } from "../config/llmmodel.js";
import { generatePdf } from "../utils/generatePdf.js";
import { getFiles } from "../utils/getFroms3.js";
import { uploadToS3 } from "../utils/uploadToS3.js";



export const pdf = async (state) => {
  try{
    const llm = getModel("pdf");
    console.log("Invoking LLM...");
    const prompt = `

    You are an expert document writer.

    Return ONLY valid JSON.

    Do NOT return markdown.

    Do NOT return explanations.

    Structure:

    {
    "title":"",
    "subtitle":"",
    "sections":[
    {
    "heading":"",
    "points":[]
    }
    ]
    }

    Generate 4-8 sections.

    Each section should have 3-6 concise bullet points.

    Topic: ${state.prompt}

    `
    const res = await llm.invoke(prompt)
    let content = res.content.trim();
    if (content.startsWith("```json")) {
      content = content.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (content.startsWith("```")) {
      content = content.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }
    const data = JSON.parse(content)
    const pdfBuffer = await generatePdf(data)
    const filename=`pdf-${Date.now()}.pdf`
    await uploadToS3(pdfBuffer, filename, "application/pdf")
    const downloadUrl = await getFiles(filename,24*60*60)
    return {
      ...state,
      aiResponse: `# PDF Generated\n\n**${data.title}**\n\n[Download PDF](${downloadUrl})\n\n_Link expires in 10 minutes._`
    }
  } catch (error) {
    console.error("Error generating PDF content:", error);
    return{
      ...state,aiResponse:"Failed to generate pdf"
    }
  }
};