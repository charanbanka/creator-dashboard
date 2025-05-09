const express = require("express");
const authRouter = require("./auth");
const feedRouter = require("./feed");
const activityRouter = require("./activities");
const userRouter = require("./user");
const creditLogsRouter = require("./creditLogs");
const analyticsRouter = require("./analytics");


const router = express.Router();

router.use("/auth", authRouter);
router.use("/feed", feedRouter);
router.use("/activities", activityRouter);
router.use("/user", userRouter);
router.use("/credit-logs", creditLogsRouter);
router.use("/analytics", analyticsRouter);

module.exports = router;
