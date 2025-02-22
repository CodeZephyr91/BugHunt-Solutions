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
