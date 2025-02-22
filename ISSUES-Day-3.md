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

