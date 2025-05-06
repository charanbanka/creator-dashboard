const jwt = require("jsonwebtoken");
const Users = require("../models/users"); // Import the User model

const isAuthenticated = async (req, res, next) => {
  // Middleware to check if the user is authenticated

  const token = req.headers["authorization"]?.split(" ")[1]; // Assuming Bearer token
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    // Verify the token (assuming JWT)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from the database using the decoded user ID
    const user = await Users.findById(decoded.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach the full user info to req.user
    req.user = user;
    next();
  } catch (err) {
    console.log("Error in isAuthenticated middleware:", err);
    return res.status(403).json({ message: "Forbidden" });
  }
};

module.exports = isAuthenticated;
