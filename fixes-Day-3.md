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

