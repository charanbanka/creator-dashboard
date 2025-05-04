const isAuthenticated = (req, res, next) => {
  // Middleware to check if the user is authenticated
  const token = req.headers["token"];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Verify the token (assuming JWT)
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }
    req.user = decoded.user;
    next();
  });
};

module.exports = isAuthenticated;
