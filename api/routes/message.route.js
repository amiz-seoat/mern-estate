import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.post("/send", verifyToken, sendMessage);

export default router;
