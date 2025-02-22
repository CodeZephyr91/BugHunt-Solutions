## Missing Root Route issue fixed:
```app.get('/',(req,res)=>{
    console.log(`Connected to the API`)
    res.send("Connection to API successful")
})```