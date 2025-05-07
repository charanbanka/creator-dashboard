const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const { check, validationResult } = require("express-validator");
const { SERVICE_SUCCESS, SERVICE_FAILURE } = require("../common/constants");
const { createCreditLog } = require("../services/creditlog-service");
const { createActivity } = require("../services/activity-service");

// Register a new user

async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ status: SERVICE_FAILURE, message: "User already exists" });
    }

    // Create a new user
    user = new User({
      name,
      email,
      password,
      credits: 60,
      role: email == "admin@gmail.com" ? "admin" : "user",
      lastLogin: new Date().toISOString(),
      profileCompleted: false,
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save the user to the database
    await user.save();

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
        email: user.email,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);

    await createCreditLog({
      userId: user._id,
      credits: 50,
      userInfo: user,
      type: "register",
    });

    await createCreditLog({
      userId: user._id,
      credits: 10,
      userInfo: user,
      type: "daily_login",
    });

    await createActivity({
      userId: user._id,
      action: "daily_login",
      userInfo: user,
    });

    res.status(201).json({
      status: SERVICE_SUCCESS,
      message: "User registered successfully",
      data: { token, user, hasLoggedInToday: true },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ status: SERVICE_FAILURE, message: "Server error" });
  }
}

// Login a user

async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ status: SERVICE_FAILURE, message: "User doesn't exist!" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: SERVICE_FAILURE, message: "Invalid credentials" });
    }

    // Generate JWT token
    const payload = {
      user: {
        id: user._id,
        email: user.email,
      },
    };

    //update credits and last login time
    //check condition if last login time is not today
    const lastLoginDate = new Date(user.lastLogin).toDateString();
    const todayDate = new Date().toDateString();
    let hasLoggedInToday = false;
    if (lastLoginDate !== todayDate) {
      hasLoggedInToday = true;
      user.credits = user.credits + 10; // Add 10 credits for logging in
      //update credit logs
      await createCreditLog({
        userId: user._id,
        credits: 10,
        userInfo: user,
        type: "daily_login",
      });

      await createActivity({
        userId: user._id,
        action: "daily_login",
        userInfo: user,
      });
    }
    //update last login time
    user.lastLogin = new Date().toISOString();
    //save user
    await user.save();

    const token = jwt.sign(payload, process.env.JWT_SECRET);

    res.status(200).json({
      status: SERVICE_SUCCESS,
      message: "User Logged in successfully",
      data: { token, user, hasLoggedInToday },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

module.exports = {
  register,
  login,
  // Add other functions like getUser, updateUser, deleteUser, etc. as needed
};
