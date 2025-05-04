const express = require("express");
const authRouter = require("./auth");
// const { isAuthenticated } = require("../services/auth-service");

const router = express.Router();

router.use("/auth", authRouter);

// router.use("/notes", isAuthenticated, notesRouter);
// router.use("/notification", isAuthenticated, notifyRouter);

module.exports = router;
