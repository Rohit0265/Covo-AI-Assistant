import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import router from './routes/chat.routes.js';


dotenv.config();

const app = express();
app.use(express.json());
app.use("/",router)
connectDB();
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`CHat server is running on port ${PORT}`);
});