const express = require("express");
const { getCreditLogsByUserIdController } = require("../controllers/creditlog-controller");
const {isAuthenticated} = require("../middleware/index"); // Middleware to authenticate users

const router = express.Router();

// Route to fetch credit logs by userId
router.get("/user-credits", isAuthenticated, getCreditLogsByUserIdController);

module.exports = router;