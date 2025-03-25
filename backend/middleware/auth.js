const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  console.log("🔹 Received Authorization Header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ No token or incorrect format.");
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];
  console.log("🔹 Extracted Token:", token);

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token Verified:", verified);

    if (!verified.userId) {
      console.error("❌ Missing userId in token payload.");
      return res.status(401).json({ message: "Invalid Token Structure" });
    }

    req.user = verified; // Attach user data to request
    next();
  } catch (error) {
    console.log("❌ Token Verification Failed:", error.message);
    res.status(401).json({ message: "Invalid or Expired Token" });
  }
};
