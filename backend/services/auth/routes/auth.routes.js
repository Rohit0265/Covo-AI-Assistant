import express from "express";
import { login } from "../controllers/auth.controllers.js";
const router = express.router()

reouter.post("/login", login);

export default router;
