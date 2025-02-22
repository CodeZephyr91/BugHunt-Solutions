## Missing Root Route issue fixed:
```js
app.get('/',(req,res)=>{
    console.log(`Connected to the API`)
    res.send("Connection to API successful")
})
```
## Hardcoded JWT Secret Key and PORT

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
## Redundant and misleading use of async in '/register' route when all functions inside are synchronous
Removed async from 
```js
app.post('/register',async(req,res))
```
## Incorrect status code for "User not found" in '/login' route
Appropriate fix for status code 404:
 ```js
 if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
```
## Redundant and unecessary async in '/login' route
After removing async:
```js
app.post('/login',(req,res)=>{
})
```
##  Missing res.status(200) in successful login response
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

## Optimization via chaining for authHeader splitting in authentication middleware
```js
const token = authHeader && authHeader.split(' ')[1];
```
optimized to:
```js
const token =authHeader?.split(' ')[1];
```
##  Missing Explicit Status Code in '/user' Route
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
        res.status(400).json({"message":"Title is required"})
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
