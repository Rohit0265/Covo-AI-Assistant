import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();

const app = express();
app.use(express.json());
connectDB();

// app.get('/', (req, res) => {
//   res.send('Hello, World!');
// });

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Auth server is running on port ${PORT}`);
});