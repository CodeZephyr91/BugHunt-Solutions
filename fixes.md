## 1.Missing Root Route issue fixed:
```js
app.get('/',(req,res)=>{
    console.log(`Connected to the API`)
    res.send("Connection to API successful")
})
```
## 2.Hardcoded JWT Secret Key and PORT

```bash
npm install dotenv
touch .env
```
JWT_secret_key=your-secret-key
PORT=3000

```js
require('dotenv').config()
const JWT_SECRET=process.env.JWT_secret_key
const PORT=process.env.PORT
```
Include .env in .gitignore

```bash
echo ".env" >> .gitignore
```
## 3.Storing plain text password in '/register' route
Updated code:
```bash
npm install bcrypt
```
```js
const bcrypt = require('bcrypt');
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (users.find(u => u.email === email)) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = {
            id: users.length + 1,
            name,
            email,
            password: hashedPassword
        };

        users.push(user);
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);

        res.status(201).json({ token, user: { id: user.id, name, email } });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user' });
    }
});
```

## 4.Storing plain text password in '/login' route
Updated code:
```bash
npm install bcrypt
```
```js
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);

        res.status(200).json({ token, user: { id: user.id, name, email } });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in' });
    }
});
```
## 5.Incorrect status code for "User not found" in '/login' route
Appropriate fix for status code 404:
 ```js
 if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
```
## 6. Missing res.status(200) in successful login response
Explicitly set res.status(200) before returning a successful response.
```js
 res.status(200).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                password: user.password.substring(0, 3)
            }
        });
```

## 7.Optimization via chaining for authHeader splitting in authentication middleware
```js
const token = authHeader && authHeader.split(' ')[1];
```
optimized to:
```js
const token =authHeader?.split(' ')[1];
```
## 8.Missing Explicit Status Code in '/user' Route
```js
 res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email
    });
```
## 9.Missing Title Validation in `/tasks` Route
Fix for the code:
```js
app.post('/tasks', authenticateToken, (req, res) => {
    const { title } = req.body;
    if(!title||title.trim===''){
        return res.status(400).json({message:"Title is required"})
    }
    const task = {
        id: tasks.length + 1,
        title,
        completed: false,
        userId: req.user.id,
    };
    tasks.push(task);
    res.status(201).json(task);
});
```
## 10. Check for missing Tasks for a given user in '/tasks' route
Fixes for the code:
```js
app.get('/tasks', authenticateToken, (req, res) => {
    const userTasks = tasks.filter(task => task.userId === req.user.id);
    if(userTasks.length === 0){
        return res.status(404).json({message:"No valid tasks assigned to the user"});
    }
    res.json(userTasks);
});
```
## 11. Explicit status for successful response in '/tasks' route
Fixed code:
```js
app.get('/tasks', authenticateToken, (req, res) => {
    const userTasks = tasks.filter(task => task.userId === req.user.id);
    if(userTasks.length === 0){
        return res.status(404).json({message:"No valid tasks assigned to the user"});
    }
    res.status(200).json(userTasks);
});
```
## 12. In the put request route '/tasks/:id', check for valid taskID missing
In case the id is invalid or NaN it cannot be parsed into an integer
Updated code:
```js
app.put('/tasks/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    if(isNaN(id)|| parseInt(id)<=0){
        return res.status(400).json({message:"Invalid ID for task"})
    }
    const { title, completed } = req.body;
    const task = tasks.find(task => task.id === parseInt(id) && task.userId === req.user.id);
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }
    task.title = title !== undefined ? title : task.title;
    task.completed = completed !== undefined ? completed : task.completed;
    res.json(task);
});
```
## 13.Valid id check missing in the delete request route for '/tasks/:id'
 In case the id is invalid or NaN it cannot be parsed into an integer
Updated code:
```js
app.delete('/tasks/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    if(isNaN(id)|| parseInt(id)<=0){
        return res.status(400).json({message:"Invalid ID for task"})
    }
    const taskIndex = tasks.findIndex(task => task.id === parseInt(id) && task.userId === req.user.id);
    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found' });
    }
    tasks.splice(taskIndex, 1);
    res.status(204).send();
});
```
## 14. MongoDB connection not implemented
### Set up MongoDB connection:
- Install MongoDB and create a database
- Use MongoDB atlas or use local MongoDB instance(using MongoDB Compass) (Cloud instance like Atlas is a better choice)
- Store the MongoDB connection string in the .env file
### Modify server.js to setup MongoDB
```js
const mongoose=require('mongoose');
const mongo_uri=process.env.mongo_uri;
mongoose.connect(mongo_uri).then(()=>console.log("Connected to MongoDB"))
.catch((err)=>console.error("MongoDB connection err: ",err));
```
### Define Mongoose schema for users and tasks
```js
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
});

const taskSchema = new mongoose.Schema({
    title: String,
    completed: Boolean,
    userId: mongoose.Schema.Types.ObjectId
});

const User = mongoose.model('User', userSchema);
const Task = mongoose.model('Task', taskSchema);
```
### Modify the authentication and task routes to use MongoDB

## 15.Better Password Policy
```bash
npm install validator
```
```js
const validator = require('validator');
if (!validator.isStrongPassword(password)) {
    return res.status(400).json({ message: 'Weak password' });
}
```