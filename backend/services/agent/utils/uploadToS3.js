import { PutObjectCommand } from "@aws-sdk/client-s3";
import r2 from "./config/r2.js";

export const uploadToS3 = async (req, res) => {

    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.CLOUDFARE_NAME,
        Key: filename,
        Body: buffer,
        ContentType: contentType,
      })
    );
    return filename
}