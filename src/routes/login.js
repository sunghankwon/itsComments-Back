const express = require("express");

const router = express.Router();

const { User } = require("../models/User");
const verifyToken = require("../middleware/verifyToken");

router.post("/", async (req, res, next) => {
  try {
    const userData = req.body.user;

    let user = await User.findOne({ email: userData.email })
      .populate("friends")
      .populate({
        path: "feedComments",
        populate: {
          path: "creator",
        },
      });

    if (!user) {
      user = await User.create({
        email: userData.email,
        nickname: userData.displayName ? userData.displayName : "Unnamed",
        icon: userData.photoURL,
      });
    }

    res.status(200).json({ user });
  } catch (error) {
    return res.status(400).json({ message: "Login failed." });
  }
});

router.post("/client", verifyToken, async (req, res, next) => {
  try {
    const userData = req.user;

    let user = await User.findOne({ email: userData.email })
      .populate({
        path: "createdComments",
        populate: {
          path: "creator",
        },
      })
      .populate({
        path: "receivedComments",
        populate: {
          path: "creator",
        },
      });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ user });
  } catch (error) {
    return res.status(400).json({ message: "Login failed." });
  }
});

module.exports = router;
