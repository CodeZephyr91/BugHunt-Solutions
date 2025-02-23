## DebugIt BugHunt
### Backend:
#### -Server.js:

##### 1.Incorrect inclusion and import of 'express'
Fix:
```js
const express=require('express');
```
##### 2. Incorrect inclusion and import of 'dotenv'
Fix:
```js
require('dotenv').config();
```
##### 3. 3.Incorrect declaration of cors using var
Fix:
```js
const cors=require('cors');
```
##### 4.app not declared in the code
Fix:
```js

const app=express();
```
##### 5. Socket class is unextended and remains unused
Fix:
Removing this line from the code:
```js
const { Socket } = require("socket.io");
```
#### userRoutes.js:
##### 1. Typo in authToken:
authToken mentioned as auhtoken in:
```js
const auhToken = jwt.sign(data, JWT_SECRET);
```
Fix:
```js
const authToken =jwt.sign(data,JWT_SECRET);
```
##### 2.Hardcoded JWT_SECRET
JWT_SECRET has been hardcoded into the code instead of being stored in a dotenv file and then being loaded dynamically
Fix:
```bash
npm install dotenv
```
```js
require('dotenv').config();
const JWT_SECRET=process.env.JWT_SECRET;
```
Inside the .env file:

JWT_SECRET=Flutio@5665#

##### 3.Using a GET request for registration on the route "/"
The first route (router.get("/")) is trying to register a new user, but user registration should be a POST request instead of GET

GET is meant for fetching data, not creating new entries
Fix in the code:
```js
router.post("/", async (req, res) => {
  let success = false;
  try {
    const { pic } = req.body;
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(400)
        .json({ error: "sorry user with this email already exists" });
    }
    console.log(req.body.password);

    let Url;
    if (pic) {
      const result = await cloudinary.uploader.upload(pic, {
        folder: "UsersImage",
      });
      Url = result.url;
      console.log(result);
    }

    user = await User.create({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
      pic: Url,
    });

    const data = {
      user: {
        id: user._id,
      },
    };
    console.log(data);
    const authToken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authToken, user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occured");
  }
});
```
##### 4.In the login route, "/login" a GET request has been used and req.body is being accessed, but as per HTTP standards GET requests don't have a body

In the login route (router.get("/login")), req.body is used to get email and password

However, GET requests do not have a request body in HTTP standards

Fix in the code:
```js
router.post("/login", async (req, res) => {
  let success = false;
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ error: "plase try to login with correct credentials" });
    }
    if (password != user.password) {
      success = false;
      return res
        .status(400)
        .json({ success, error: "plase try to login with correct password" });
    }
    const data = {
      user: {
        id: user.id,
      },
    };
    const authToken =jwt.sign(data,JWT_SECRET);
    success = true;
    res.json({ success, authToken, user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");
  }
});
```

#### chatRoutes.js:
##### 1.Multiple router.route("/") calls without chaining
Fix:
```js
router.route("/")
  .post(protect, accessChat)
  .get(protect, fetchChat)
  .delete(protect, DeleteChat);
```
##### 2.Missing protect middleWare from deletion of chat
The DeleteChat route does not have protect

This means anyone can delete a chat without authentication, which is a security risk
Fix:
```js
delete(protect, DeleteChat);
```

##### 1. Plain text in error message instead of a JSON
The response sends plain text "Not Authorised ,no token", instead of a json
```js
res.status(401).json({message:"Not Authorised ,no token"});
```
##### 2.Duplicate Unauthorized Response
```js
 try {
        token =req.headers.authorization.split(' ')[1];
        const decoded =jwt.verify(token,JWT_SECRET);

        req.user =await User.findById(decoded.user.id).select('-password');
            
        next();
        } catch (error) {
            res.status(401).json({message:"Not Authorised ,no token"});
        }
```

#### - ChatModel.js
##### 1.Incorrect type for users, latestMessage, and groupAdmin
The users, latestMessage, and groupAdmin fields are incorrectly defined as type: string

In Mongoose, references to other collections should use Schema.Types.ObjectId, not string
Fix:
Replace string with Schema.Types.ObjectId to correctly reference other collections.
```js
users: [{ type: Schema.Types.ObjectId, ref: "User" }],
latestMessage: {
  type: Schema.Types.ObjectId,
  ref: "Message",
},
groupAdmin: { type: Schema.Types.ObjectId, ref: "User" },
```
##### 2.users should be an array of ObjectIds
users is meant to store multiple users but was mistakenly typed as an array of string values
The users field should store an array of ObjectIds, but it was mistakenly defined as an array of strings
Fix:
```js
users: [{ type: Schema.Types.ObjectId, ref: "User" }],
```
#### - MessageModel.js
##### 1. Incorrect Data Type for sender and Chat
The sender and Chat fields are incorrectly defined as type: string

These fields should reference other collections using Schema.Types.ObjectId
Fix:
Replace string with Schema.Types.ObjectId and setting proper references:
```js
sender: {
  type: Schema.Types.ObjectId,
  ref: "User",
  required: true,
},
Chat: {
  type: Schema.Types.ObjectId,
  ref: "Chat",
  required: true,
},
```
#### -User.js
##### 1.Incorrect PhoneNo Type
PhoneNo is defined as a Number which does not support leading zeros
Fix:
```js
phoneNo: {
  type: String,
},
```
##### 2.Incorrect DOB Type
DOB is defined as a String, but it represents a date
```js
dob: {
  type: Date,
},
```
#### -data.js
##### 1. Based on the schema changes, users and groupAdmin need to store MongoDB ObjectIds
```js
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const chats = [
  {
    isGroupChat: false,
    users: [new ObjectId("617a077e18c25468bc7c4dd1"), new ObjectId("617a077e18c25468bc7c4dd2")],
    _id: new ObjectId("617a077e18c25468bc7c4dd4"),
    chatName: "John Doe",
  },
  {
    isGroupChat: false,
    users: [new ObjectId("617a077e18c25468bc7c4dd3"), new ObjectId("617a077e18c25468bc7c4dd2")],
    _id: new ObjectId("617a077e18c25468b27c4dd4"),
    chatName: "Guest User",
  },
  {
    isGroupChat: false,
    users: [new ObjectId("617a077e18c25468bc7c4dd5"), new ObjectId("617a077e18c25468bc7c4dd2")],
    _id: new ObjectId("617a077e18c2d468bc7c4dd4"),
    chatName: "Anthony",
  },
  {
    isGroupChat: true,
    users: [
      new ObjectId("617a077e18c25468bc7c4dd1"),
      new ObjectId("617a077e18c25468bc7c4dd2"),
      new ObjectId("617a077e18c25468bc7c4dd3"),
    ],
    _id: new ObjectId("617a518c4081150716472c78"),
    chatName: "Friends",
    groupAdmin: new ObjectId("617a077e18c25468bc7c4dd3"),
  },
  {
    isGroupChat: false,
    users: [new ObjectId("617a077e18c25468bc7c4dd6"), new ObjectId("617a077e18c25468bc7c4dd2")],
    _id: new ObjectId("617a077e18c25468bc7cfdd4"),
    chatName: "Jane Doe",
  },
  {
    isGroupChat: true,
    users: [
      new ObjectId("617a077e18c25468bc7c4dd1"),
      new ObjectId("617a077e18c25468bc7c4dd2"),
      new ObjectId("617a077e18c25468bc7c4dd3"),
    ],
    _id: new ObjectId("617a518c4081150016472c78"),
    chatName: "Chill Zone",
    groupAdmin: new ObjectId("617a077e18c25468bc7c4dd3"),
  },
];

module.exports = chats;
```
#### -userController.js
##### 1.Alignment of userController.js with respect to the updated schema
##### 2.Handling Image upload properly
##### 3.Error handling for user not found
```js
const asyncHandler = require("express-async-handler");
const User = require("../Models/User");
const cloudinary = require("../Cloudinary");

//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword);
  res.json(users);
});

//@description     Update user details
//@route           PUT /api/user/update
//@access          Only user
const UpdateUser = asyncHandler(async (req, res) => {
  const { name, email, description, phoneNo, pic, dob } = req.body;

  let updateFields = { name, email, description, phoneNo, dob };

  if (pic) {
    try {
      const result = await cloudinary.uploader.upload(pic, {
        folder: "UsersImage",
      });
      updateFields.pic = result.url;
    } catch (error) {
      return res.status(500).json({ error: "Image upload failed" });
    }
  }

  const user = await User.findByIdAndUpdate(req.user._id, { $set: updateFields }, { new: true });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(user);
});

module.exports = { allUsers, UpdateUser };

```

#### -messageController.js
##### 1.Alignment of messageController.js with respect to the updated schema
```js
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

```

#### -chatController.js
##### 1.Alignment of chatController.js with respect to the updated schema

```js
const asyncHandler = require("express-async-handler");
const Chat = require("../Models/ChatModel");
const User = require("../Models/User");

//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  
  if (!userId) {
    console.log("UserId parameter not sent with request");
    return res.sendStatus(400);
  }

  await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.json(isChat[0]);
  } else {
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    
    const createdChat = await Chat.create(chatData);
    const fullChat = await Chat.findById(createdChat._id).populate("users", "-password");
    res.status(201).json(fullChat);
  }
});

// @description     Delete One to One or Group Chat
// @route           DELETE /api/chat/
// @access          Protected
const deleteChat = asyncHandler(async (req, res) => {
  const { chatId } = req.body;

  const removed = await Chat.findByIdAndDelete(chatId);

  if (!removed) {
    return res.status(404).json({ message: "Chat Not Found" });
  }
  res.json(removed);
});

//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected
const fetchChat = asyncHandler(async (req, res) => {
  try {
    const chats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//@description     Create New Group Chat
//@route           POST /api/chat/group
//@access          Protected
const createGroupChat = asyncHandler(async (req, res) => {
  const { users, name } = req.body;
  
  if (!users || !name) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }

  const parsedUsers = JSON.parse(users);

  if (parsedUsers.length < 2) {
    return res.status(400).json({ message: "At least 2 users are required to create a group chat" });
  }

  parsedUsers.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: name,
      users: parsedUsers,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findById(groupChat._id)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(201).json(fullGroupChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @description    Rename Group
// @route          PUT /api/chat/rename
// @access         Protected
const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    return res.status(404).json({ message: "Chat Not Found" });
  }
  res.json(updatedChat);
});

// @description    Add user to Group
// @route          PUT /api/chat/groupadd
// @access         Protected
const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { $push: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    return res.status(404).json({ message: "Chat Not Found" });
  }
  res.json(updatedChat);
});

// @description    Remove user from Group
// @route          PUT /api/chat/groupremove
// @access         Protected
const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    return res.status(404).json({ message: "Chat Not Found" });
  }
  res.json(updatedChat);
});

module.exports = {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  addToGroup,
  deleteChat,
  removeFromGroup,
};
```