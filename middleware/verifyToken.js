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
      return res.send({ result: "fail", message: "All tokens have expired." });
    }

    const decodedData = await admin.auth().verifyIdToken(accessToken);
    req.user = decodedData;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized - Invalid tokens" });
  }
};

module.exports = verifyToken;
