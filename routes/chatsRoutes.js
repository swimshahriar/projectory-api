import { Router } from "express";

// internal imports
import {
  createConversation,
  getConversations,
} from "../controller/chatController.js";
import { checkAuth } from "../middleware/checkAuth.js";

const router = Router();

// routes
router.post("/conversations/:receiverId", checkAuth, createConversation);
router.get("/conversations", checkAuth, getConversations);

// export
export const chatsRoutes = router;
