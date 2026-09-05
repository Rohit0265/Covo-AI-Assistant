import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();
const app = express();
app.use(express.json());
// app.use("/",router)
connectDB();
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`agent server is running on port ${PORT}`);
});