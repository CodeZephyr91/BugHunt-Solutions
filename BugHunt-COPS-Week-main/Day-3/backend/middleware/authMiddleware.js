const jwt=require('jsonwebtoken');
const User = require("../Models/User");
const asyncHandler=require('express-async-handler');
const JWT_SECRET = "Flutio@5665#";

const protect =asyncHandler(async(req,res,next)=>{
    let token;

    if(
        req.headers.authorization && req.headers.authorization.startsWith('Bearer')
    )
    try {
        token =req.headers.authorization.split(' ')[1];
        const decoded =jwt.verify(token,JWT_SECRET);

        req.user =await User.findById(decoded.user.id).select('-password');
            
        next();
        } catch (error) {
            res.status(401).json({message:"Not Authorised ,no token"});
        }


})

module.exports = {protect};
