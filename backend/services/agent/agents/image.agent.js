import { getModel } from "../config/llmmodel.js";
import axios from "axios";
import { uploadToS3 } from "../utils/uploadToS3.js";
import { getFiles } from "../utils/getFroms3.js";

export const image = async (state) => {


  try{

  

  const llm = getModel("image");
  console.log("Invoking LLM...");
  const res = await llm.invoke(`  You are elite AI image prompt engineer.

  Convert the user request into a highly detailed image generation prompt.

  Requirements:

  - Cinematic lighting
  - Professional composition
  - Ultra realistic
  - High detail
  - Beautiful color palette
  - Sharp focus
  - 8K quality
  - Photorealistic
  - Depth of field
  - Professional photography
  - Stunning visuals

  Return only the image prompt.

  User Request:
  ${state.prompt}`);

    const prompt = res.content.trim().replace(/^["'*]+|["'*]+$/g, '').replace(/\r?\n|\r/g, ' ');
    console.log("LLM returned prompt:", prompt);

    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

    console.log("Fetching image from:", imageUrl);
    const imageRes = await axios.get(imageUrl, { responseType: "arraybuffer" });
    
    console.log("Image fetched, uploading to S3...");
    const buffer = Buffer.from(imageRes.data);

    const filename = `image_${Date.now()}.png`;
    await uploadToS3(buffer, filename, "image/png");
    
    console.log("Uploaded to S3. Getting signed URL...");
    const downloadUrl = await getFiles(filename, 24*60*60);
    
    console.log("Success. Returning result.");
    return {
        ...state,
        aiResponse: `# Image Generated Successfully\n\n![Generated Image](${downloadUrl})\n\n[Download Image](${downloadUrl})\n\nLink expires in 10 minutes.`
    };
  }catch (error) {
    console.error("Error generating image:", error.message || error);
    return {
      ...state,
      aiResponse: "Sorry, there was an error generating the image. Please try again later."
    };
  }
};
