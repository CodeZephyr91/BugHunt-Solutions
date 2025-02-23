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
