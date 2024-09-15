const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
require("dotenv").config();

const router = express.Router();
const JWT_TOKEN = process.env.JWT_TOKEN;

// Create a new user
// return a token
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = new User({ name, email, password });
    await user.save();
    const token = jwt.sign({ id: user._id }, JWT_TOKEN);
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Login the user
// return a token
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Account not found" });
    }

    if (!(await user.matchPassword(password))) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    const token = jwt.sign({ id: user._id }, JWT_TOKEN);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
