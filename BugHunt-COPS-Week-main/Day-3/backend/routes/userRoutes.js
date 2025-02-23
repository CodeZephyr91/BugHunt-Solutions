const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const { allUsers, UpdateUser } = require("../controllers/userController");
require("dotenv").config();
const cloudinary = require("../Cloudinary");

const JWT_SECRET = process.env.JWT_SECRET;

// @route   POST /api/users
// @desc    Register a new user
router.post("/", async (req, res) => {
  try {
    const { name, email, password, pic, role, preferences } = req.body; 
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User with this email already exists" });
    }
    let Url = "";
    if (pic) {
      const result = await cloudinary.uploader.upload(pic, { folder: "UsersImage" });
      Url = result.secure_url;
    }a
    user = await User.create({
      name,
      email,
      password,
      pic: Url,
      role,        
      preferences,  
    });
    const authToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ success: true, authToken, user });
  } catch (error) {
    console.error("Error in registration:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// @route   POST /api/users/login
// @desc    Authenticate user & get token
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const authToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ success: true, authToken, user });
  } catch (error) {
    console.error("Error in login:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.route("/").get(allUsers);
router.route("/update").put(UpdateUser);

module.exports = router;
