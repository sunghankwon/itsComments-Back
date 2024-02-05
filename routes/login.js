const express = require("express");

const router = express.Router();

const { User } = require("../Models/User");

router.post("/", async (req, res) => {
  try {
    const userData = req.body.user;

    res.cookie("accessToken", userData.stsTokenManager.accessToken);
    res.cookie("refreshToken", userData.stsTokenManager.refreshToken);

    let user = await User.findOne({ email: userData.email });

    if (!user) {
      user = await User.create({
        email: userData.email,
        nickname: userData.displayName,
        icon: userData.photoURL,
      });
    }

    res.status(200).json({ user });
  } catch (error) {
    return res.status(400).json({ message: "Login failed." });
  }
});

module.exports = router;
