## DebugIt BugHunt
### Backend:
#### -Server.js:

##### 1.Incorrect inclusion and import of 'express'
Not the correct syntax for importing and including express

##### 2. Incorrect inclusion and import of 'dotenv'
Not the correct syntax for importing and including express

##### 3.Incorrect declaration of cors using var
Using const is the recommended approach because cors does not need to be reassigned. Avoiding var improves code consistency and prevents unintended reassignments

##### 4.app not declared in the code
Using app.use(express.json()); before defining app

##### 5. Socket class is unextended and remains unused
Socket is imported but never used.It does not initialize the web Socket server but a WebSocket instance is created in a separate line
```js
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://chat-buddy-hgxs6aqne-vivek-mauryas-projects.vercel.app",
  },
});
```
Its better to remove this unused import to make the code cleaner.

#### - userRoutes.js:
##### 1. Typo in authToken:
authToken mentioned as auhtoken in:
```js
const auhToken = jwt.sign(data, JWT_SECRET);
```

##### 2.Hardcoded JWT_SECRET
JWT_SECRET has been hardcoded into the code instead of being stored in a dotenv file and then being loaded dynamically

##### 3.Using a GET request for registration on the route "/"
The first route (router.get("/")) is trying to register a new user, but user registration should be a POST request instead of GET


GET is meant for fetching data, not creating new entries

##### 4.In the login route, "/login" a GET request has been used and req.body is being accessed, but as per HTTP standards GET requests don't have a body

In the login route (router.get("/login")), req.body is used to get email and password

However, GET requests do not have a request body in HTTP standards


#### - chatRoutes.js:
##### 1.Multiple router.route("/") calls without chaining
Defining the route again and again for different methods of request is redundant and unncecessary

##### 2.Missing protect middleWare from deletion of chat
The DeleteChat route does not have protect

This means anyone can delete a chat without authentication, which is a security risk

#### - authMiddleware.js

##### 1. Plain text in error message instead of a JSON
The response sends plain text "Not Authorised ,no token", instead of a json
```js
res.status(401).json({message:"Not Authorised ,no token"});
```
##### 2.Duplicate Unauthorized Response
If token is missing or invalid, the middleware sends two different 401 responses:
- Inside catch block: res.status(401).json('Not Authorised ,no token');
- Outside try-catch block: res.status(401).json('Not authorised ,no token');

##### 3. Hardcoded JWT_SECRET:
JWT_SECRET has been hardcoded into the code instead of being stored in a dotenv file and then being loaded dynamically

#### - ChatModel.js
##### 1.Incorrect type for users, latestMessage, and groupAdmin
The users, latestMessage, and groupAdmin fields are incorrectly defined as type: string

In Mongoose, references to other collections should use Schema.Types.ObjectId, not string
##### 2.users should be an array of ObjectIds
users is meant to store multiple users but was mistakenly typed as an array of string values

#### - MessageModel.js
##### 1. Incorrect Data Type for sender and Chat
The sender and Chat fields are incorrectly defined as type: string

These fields should reference other collections using Schema.Types.ObjectId
```js
sender: {
  type: string,
  trim: true,
},
Chat: {
  type: string,
  ref: "Chat",
},
```

