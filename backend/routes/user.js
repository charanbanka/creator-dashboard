const express = require("express");
const {
  updateUserProfileController,
  fetchUserProfileController,
  fetchAllUsersController,
  updateUserCreditsController,
} = require("../controllers/user-controller");
const {isAuthenticated, isAdmin} = require("../middleware/index"); // Middleware to authenticate users

const router = express.Router();

// Route to update user profile
router.post("/update-profile", isAuthenticated, updateUserProfileController);
router.get("/fetch", isAuthenticated, fetchUserProfileController);

router.get("/all", isAuthenticated, isAdmin, fetchAllUsersController);
router.put("/update-credits", isAuthenticated, isAdmin, updateUserCreditsController);


module.exports = router;
