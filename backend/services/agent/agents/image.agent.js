import { getModel } from "../config/llmmodel.js";
import axios from "axios";

export const image = async (state) => {


  try{

  

  const llm = getModel("image");
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

    const prompt = res.content.trim();

    const imageUrl = `
    https://gen.pollinations.ai/prompt/${encodeURIComponent(prompt)}`


    const imageRes = await axios.get(imageUrl, { responseType: "arraybuffer" });

    
    const buffer = Buffer.from(imageRes.data);

    const filename = `image_${Date.now()}.png`;
    await uploadToS3(buffer, filename, "image/png");
    const downloadUrl = await getFiles(filename, 24*60*60);

    return {
        ...state,
        aiResponse:`
        # Image Generated Successfully

        ![Generated Image](${downloadUrl})
        [Download Image](${downloadUrl})

        Link expires in 10 minutes.
        `
    };
  }catch (error) {
    console.error("Error generating image:", error.message || error);
    return {
      ...state,
      aiResponse: "Sorry, there was an error generating the image. Please try again later."
    };
  }
};
