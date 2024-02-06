const express = require("express");

const router = express.Router();

const { User } = require("../models/User");

router.post("/", async (req, res, next) => {
  try {
    const userData = req.body.user;

    let user = await User.findOne({ email: userData.email });

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

module.exports = router;
