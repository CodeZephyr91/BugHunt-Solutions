const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Message = require("../Models/MessageModel");
const User = require("../Models/User");
const Chat = require("../Models/ChatModel");
const cloudinary = require("../Cloudinary");

//@description     Create New Message
//@route           POST /api/message/
//@access          Protected
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId, image } = req.body;

  if (!content || !chatId) {
    return res.status(400).json({ error: "Invalid data passed into request" });
  }

  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    return res.status(400).json({ error: "Invalid Chat ID format" });
  }

  let Url;
  if (image) {
    try {
      const result = await cloudinary.uploader.upload(image, {
        folder: "messageImage",
      });
      Url = result.url;
    } catch (error) {
      return res.status(500).json({ error: "Image upload failed" });
    }
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
    image: Url || undefined,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//@description     Get all Messages
//@route           GET /api/message/:chatId
//@access          Protected
const allMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    return res.status(400).json({ error: "Invalid Chat ID format" });
  }

  try {
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    if (!messages.length) {
      return res.status(404).json({ error: "No messages found" });
    }

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = { sendMessage, allMessages };
