const express = require("express");
const Model = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

require("dotenv").config();

const router = express.Router();


// =====================================
// SIGNUP / ADD USER  
// =====================================

router.post("/add", async (req, res) => {
  try {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existingUser = await Model.findOne({
      email: email.trim().toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const user = new Model({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });

    const result = await user.save();

    res.status(201).json({
      message: "Account created successfully",
      user: {
        _id: result._id,
        name: result.name,
        email: result.email,
      },
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Failed to create account",
    });

  }
});


// =====================================
// LOGIN
// =====================================

router.post("/authenticate", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await Model.findOne({
      email: email.trim().toLowerCase(),
      password,
    });

    if (!user) {

      return res.status(403).json({
        message: "Invalid email or password",
      });

    }

    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({

      token,

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Login failed",
    });

  }

});


// =====================================
// GET ALL USERS
// =====================================

router.get("/getall", auth, async (req, res) => {

  try {

    const users = await Model.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(users);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Failed to fetch users",
    });

  }

});


module.exports = router;