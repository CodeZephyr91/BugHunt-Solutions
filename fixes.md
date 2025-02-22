## Missing Root Route issue fixed:
```js
app.get('/',(req,res)=>{
    console.log(`Connected to the API`)
    res.send("Connection to API successful")
})

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
