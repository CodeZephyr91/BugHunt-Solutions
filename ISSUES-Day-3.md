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

#### chatRoutes.js:
##### 1.Multiple router.route("/") calls without chaining
Defining the route again and again for different methods of request is redundant and unncecessary


