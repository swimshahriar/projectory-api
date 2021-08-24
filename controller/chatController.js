import mongoose from "mongoose";
// internal imports
import { Conversations, Messages } from "../model/chatsModel.js";
import { User } from "../model/userModel.js";
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
  const { _id: senderId, userName } = req.user;
  const { receiverId } = req.params;

  //check if already conversation exist
  const isExist = await Conversations.findOne({
    members: {
      $all: [
        mongoose.Types.ObjectId(senderId),
        mongoose.Types.ObjectId(receiverId),
      ],
    },
  });

  if (isExist) {
    return res.status(200).json({
      status: "success",
      cid: isExist._id,
    });
  }

  // get userName of the recieverId
  const recieverIdObj = mongoose.Types.ObjectId(receiverId);
  const recUser = await User.findById(recieverIdObj);

  // create new conversations
  const conversations = new Conversations({
    members: [senderId, recieverIdObj],
    userName: {
      [senderId]: userName,
      [receiverId]: recUser.userName,
    },
  });
  await conversations.save();

  return res.status(201).json({
    status: "success",
    conversations,
  });
});

// ----------------------- new message ------------------
export const newMessage = catchAsync(async (req, res, next) => {
  const { _id: senderId } = req.user;
  const { cid } = req.params;
  const { text } = req.body;

  // check if conversatin exist
  const isExist = await Conversations.findById(cid);
  if (!isExist) {
    return res.status(404).json({
      status: "fail",
      message: "Wrong conversation id.",
    });
  }

  // update conversation
  isExist.lastMsg = text;
  await isExist.save();

  // save new msg
  const messages = new Messages({
    conversationId: cid,
    senderId,
    text,
  });
  await messages.save();

  return res.status(201).json({
    status: "success",
    messages,
  });
});

// ------------------- get messages -------------------
export const getMessages = catchAsync(async (req, res, next) => {
  const { cid } = req.params;
  const { _id: uid } = req.user;

  // check if conversation exist
  const isExist = await Conversations.findOne({
    _id: cid,
    members: { $in: [uid] },
  });

  if (!isExist) {
    return res.status(404).json({
      status: "fail",
      message: "Wrong conversation id or you are not in that conversation.",
    });
  }

  // get all the messages of that cid
  const messages = await Messages.find({ conversationId: cid });

  return res.status(200).json({
    status: "success",
    messages,
  });
});
