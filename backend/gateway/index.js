import express from "express"
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import proxy from "express-http-proxy";
import {protect} from "./middleware/auth.middleware"
import getCurrentUser from "./controllers/user.controllers";





dotenv.config();
const port = process.env.PORT || 3000;

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(cookieParser());
app.use("/auth",proxy(process.env.AUTH_SERVICE_URL));
app.get("/me",protect,getCurrentUser)

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Gateway is running on port ${port}`);
}); 