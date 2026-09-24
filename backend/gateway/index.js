import express from "express"
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import proxy from "express-http-proxy";
import protect from "./middleware/auth.middleware.js"
import getCurrentUser from "./controllers/user.controllers.js";
import { proxyHeader } from "./utils/proxyHeader.js";





dotenv.config();
const port = process.env.PORT || 3000;

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(cookieParser());
app.use("/api/auth",proxy(process.env.AUTH_SERVICE_URL));
app.get("/api/me",protect,getCurrentUser)
app.use("/api/chat",protect,proxyHeader(process.env.CHAT_SERVICE_URL))
app.use("/api/agent",protect,proxyHeader(process.env.AGENT_SERVICE_URL))
app.use("/api/billing",protect,proxyHeader(process.env.BILLING_SERVICE_URL))
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Gateway is running on port ${port}`);
}); 