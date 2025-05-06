const express = require("express");
const {
  updateUserProfileController,
  fetchUserProfileController,
} = require("../controllers/user-controller");
const isAuthenticated = require("../middleware/index"); // Middleware to authenticate users

const router = express.Router();

// Route to update user profile
router.post("/update-profile", isAuthenticated, updateUserProfileController);
router.get("/fetch", isAuthenticated, fetchUserProfileController);

module.exports = router;
