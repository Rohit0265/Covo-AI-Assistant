import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';


dotenv.config();

const app = express();
app.use(express.json());
connectDB();
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`CHat server is running on port ${PORT}`);
});