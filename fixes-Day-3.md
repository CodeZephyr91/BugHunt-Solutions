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