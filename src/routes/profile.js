const express = require("express");

const router = express.Router();

const { User } = require("../models/User");
const s3Uploader = require("../middleware/s3Uploader");

router.patch("/", s3Uploader.single("profileIcon"), async (req, res, next) => {
  try {
    const user = await User.findById(req.body.userId)
      .populate("friends")
      .populate({
        path: "feedComments",
        populate: {
          path: "creator",
        },
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const iconKey = req.file.key;
    const profileIcon = `${process.env.CLOUD_FROUNT}/${iconKey}`;

    user.icon = profileIcon;

    await user.save();

    console.log(user.icon);
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Profile updated failed" });
  }
});

module.exports = router;
