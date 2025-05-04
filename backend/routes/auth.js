//create two routes for login and register
const express = require("express");
const { check, validationResult } = require("express-validator");
const { login, register } = require("../controllers/auth-controller");

const authRouter = express.Router();

authRouter.post(
  "/login",
  [
    check("name", "Name is required").not().isEmpty(),
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
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  register
);

module.exports = authRouter;
