import { uploadToS3 } from "./utils/uploadToS3.js";
import { getFiles } from "./utils/getFroms3.js";
import dotenv from "dotenv";
dotenv.config();

async function run() {
  try {
    const buffer = Buffer.from("hello world");
    const filename = "test.txt";
    console.log("Uploading...");
    await uploadToS3(buffer, filename, "text/plain");
    console.log("Uploaded. Getting URL...");
    const url = await getFiles(filename, 3600);
    console.log("URL:", url);
  } catch (err) {
    console.error("S3 Error:", err);
  }
  process.exit(0);
}
run();
