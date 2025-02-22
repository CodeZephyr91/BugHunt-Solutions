const mongoose = require("mongoose");
const { Schema } = mongoose;

const userModel = new Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
    },
    Password: {
      type: String,
      required: true,
    },
    pic: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    Description: {
      type: String,
    },
    PhoneNo: {
      type: Number,
    },
    DOB: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userModel);

module.exports = User;
