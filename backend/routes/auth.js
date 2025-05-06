//create two routes for login and register
const express = require("express");
const { check, validationResult } = require("express-validator");
const { login, register } = require("../controllers/auth-controller");

const authRouter = express.Router();

authRouter.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  login
);

authRouter.post(
  "/register",
  [
    check("name", "Name is required").exists(),
    check("name", "Name must be at least 2 characters").isLength({ min: 2 }),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  register
);

module.exports = authRouter;
