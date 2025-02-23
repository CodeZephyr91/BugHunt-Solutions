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
