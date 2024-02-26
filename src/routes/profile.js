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

    if (req.body.nickname) {
      const changeNickname = req.body.nickname;

      if (changeNickname.length < 2 || changeNickname.length > 20) {
        return res
          .status(400)
          .json({ message: "Nickname must be between 2 and 20 characters." });
      }

      user.nickname = changeNickname;
    }

    if (req.file && req.file.key) {
      const iconKey = req.file.key;
      const profileIcon = `${process.env.CLOUD_FROUNT}/${iconKey}`;
      user.icon = profileIcon;
    }

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Profile updated failed" });
  }
});

module.exports = router;
