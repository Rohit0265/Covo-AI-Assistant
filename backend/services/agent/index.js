import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import router from './routes/agent.routes.js';
import { ListBucketsCommand } from "@aws-sdk/client-s3";
import r2 from "./config/r2.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use("/",router)
connectDB();
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`agent server is running on port ${PORT}`);
});




import { PutObjectCommand } from "@aws-sdk/client-s3";
// import r2 from "./config/r2.js";

app.get("/test-r2", async (req, res) => {
  try {
    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.CLOUDFARE_NAME,
        Key: "test.txt",
        Body: "R2 connection is working!",
        ContentType: "text/plain",
      })
    );

    res.json({
      success: true,
      message: "R2 connected and file uploaded successfully",
    });
  } catch (error) {
    console.error("R2 ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
      code: error.Code,
    });
  }
});