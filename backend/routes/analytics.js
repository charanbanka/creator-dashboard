const express = require("express");
const {
  getCreditsByDayController,
  getUserActivityController,
  getFeedSourcesController,
  getFeedActionsController,
} = require("../controllers/analytics-controller");
const { isAuthenticated } = require("../middleware/index");

const router = express.Router();

router.get("/credits-by-day", isAuthenticated, getCreditsByDayController);
router.get("/user-activity", isAuthenticated, getUserActivityController);
router.get("/feed-sources", isAuthenticated, getFeedSourcesController);
router.get("/feed-actions", isAuthenticated, getFeedActionsController);

module.exports = router;
