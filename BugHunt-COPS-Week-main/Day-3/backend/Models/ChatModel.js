const mongoose = require("mongoose");
const { Schema } = mongoose;
const chatModel = new Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: string, ref: "User" }],
    latestMessage: {
      type: string,
      ref: "Message",
    },
    groupAdmin: { type: string, ref: "User" },
    pic: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/previews/000/550/535/original/user-icon-vector.jpg",
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;
