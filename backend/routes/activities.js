const express = require("express");
const {
  createActivityController,
  getActivitiesByUserIdController,
} = require("../controllers/activity-controller");
const {isAuthenticated} = require("../middleware/index"); // Middleware to authenticate users

const activityRouter = express.Router();

// Route to create an activity
activityRouter.post("/create", isAuthenticated, createActivityController);

// Route to fetch activities by userId
activityRouter.get(
  "/user-activities",
  isAuthenticated,
  getActivitiesByUserIdController
);

module.exports = activityRouter;
