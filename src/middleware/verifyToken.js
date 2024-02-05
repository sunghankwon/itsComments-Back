const admin = require("firebase-admin");

const serviceAccount = require(process.env.GOOGLE_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const verifyToken = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken || !refreshToken) {
      return res.status(400).json({ message: "The token does not exist." });
    }

    let decodedData;

    try {
      decodedData = await admin.auth().verifyIdToken(accessToken);
    } catch (error) {
      if (error.code === "auth/id-token-expired") {
        const user = await admin.auth().verifyIdToken(refreshToken);
        const newAccessToken = await user.getIdToken();
        decodedData = await admin.auth().verifyIdToken(newAccessToken);
      } else {
        return res.status(400).json({ message: error.message });
      }
    }

    next();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = verifyToken;
