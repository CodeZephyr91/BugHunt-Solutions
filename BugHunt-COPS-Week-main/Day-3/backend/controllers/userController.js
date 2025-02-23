const asyncHandler = require("express-async-handler");
const User = require("../Models/User");
const cloudinary = require("../Cloudinary");

//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword);
  res.json(users);
});

//@description     Update user details
//@route           PUT /api/user/update
//@access          Only user
const UpdateUser = asyncHandler(async (req, res) => {
  const { name, email, description, phoneNo, pic, dob } = req.body;

  let updateFields = { name, email, description, phoneNo, dob };

  if (pic) {
    try {
      const result = await cloudinary.uploader.upload(pic, {
        folder: "UsersImage",
      });
      updateFields.pic = result.url;
    } catch (error) {
      return res.status(500).json({ error: "Image upload failed" });
    }
  }

  const user = await User.findByIdAndUpdate(req.user._id, { $set: updateFields }, { new: true });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(user);
});

module.exports = { allUsers, UpdateUser };
