const express = require("express");
const router = express.Router();
const User = require("../Models/User");
var jwt = require("jsonwebtoken");
const { allUsers, UpdateUser } = require("../controllers/userController");
const JWT_SECRET = "Flutio@5665#";
const cloudinary = require("../Cloudinary");

router.get("/", async (req, res) => {
  let success = false;
  try {
    const { pic } = req.body;
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(400)
        .json({ error: "sorry user with this email already exists" });
    }
    console.log(req.body.password);

    let Url;
    if (pic) {
      const result = await cloudinary.uploader.upload(pic, {
        folder: "UsersImage",
      });
      Url = result.url;
      console.log(result);
    }

    user = await User.create({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
      pic: Url,
    });

    const data = {
      user: {
        id: user._id,
      },
    };
    console.log(data);
    const auhToken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, auhToken, user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occured");
  }
});

router.get("/login", async (req, res) => {
  let success = false;
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ error: "plase try to login with correct credentials" });
    }
    if (password != user.password) {
      success = false;
      return res
        .status(400)
        .json({ success, error: "plase try to login with correct password" });
    }
    const data = {
      user: {
        id: user.id,
      },
    };
    const auhToken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, auhToken, user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");
  }
});

router.route("/").get(allUsers);

router.route("/update").put(UpdateUser);

module.exports = router;
