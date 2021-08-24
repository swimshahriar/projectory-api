// internal imports
import { Conversations, Messages } from "../model/chatsModel.js";
import catchAsync from "../utils/catchAsync.js";

// ----------------- get conversations ----------------
export const getConversations = catchAsync(async (req, res, next) => {
  const { _id: uid } = req.user;

  const conversations = await Conversations.find({ members: { $in: [uid] } });

  return res.status(200).json({
    status: "success",
    conversations,
  });
});

// ------------------- create conversation ------------------
export const createConversation = catchAsync(async (req, res, next) => {
  const { _id: senderId } = req.user;
  const { receiverId } = req.params;

  //check if already conversation exist
  const isExist = await Conversations.findOne({
    members: { $all: [senderId, receiverId] },
  });

  if (isExist) {
    return res.status(400).json({
      status: "fail",
      message: "Conversation already exist.",
    });
  }

  // create new conversations
  const newConversations = new Conversations({
    members: [senderId, receiverId],
  });
  await newConversations.save();

  // get all the conversations
  const conversations = await Conversations.find({
    members: { $in: [senderId] },
  });

  return res.status(201).json({
    status: "success",
    conversations,
  });
});
