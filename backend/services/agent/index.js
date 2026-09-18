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




