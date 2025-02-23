const mongoose = require("mongoose");
const { Schema } = mongoose;

const MessageModel = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    Chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat", 
      required: true,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", MessageModel);

module.exports = Message;
