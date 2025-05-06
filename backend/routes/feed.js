//create two routes for feed controller
const express = require("express");
const isAuthenticated = require("../middleware/index");
const {
  getSavedPostsController,
  saveFeedController,
  reportFeedController,
  unSaveFeedController,
  shareFeedController,
} = require("../controllers/feed-controller");

const router = express.Router();

router.get("/saved-posts", isAuthenticated, getSavedPostsController);
router.post("/save-post", isAuthenticated, saveFeedController);
router.post("/share-post", isAuthenticated, shareFeedController);
router.post("/report-post", isAuthenticated, reportFeedController);
router.post("/unsave-post", isAuthenticated, unSaveFeedController);

module.exports = router;
