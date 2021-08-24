import { Router } from "express";

// internal imports
import {
  createConversation,
  getConversations,
  newMessage,
  getMessages,
} from "../controller/chatController.js";
import { checkAuth } from "../middleware/checkAuth.js";
import {
  chatsValidateRules,
  validate,
} from "../middleware/validators/chatsValidator.js";

const router = Router();

// routes
router.post("/conversations/:receiverId", checkAuth, createConversation);
router.get("/conversations", checkAuth, getConversations);
router.post("/:cid", chatsValidateRules(), validate, checkAuth, newMessage);
router.get("/:cid", checkAuth, getMessages);

// export
export const chatsRoutes = router;
