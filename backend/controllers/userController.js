const mongoose = require("mongoose");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
 
// @desc    Register a user
// @route   POST /api/users/
// @access  Public
exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  // check if user exits
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // generate salt to hash the password
  const salt = await bcrypt.genSalt(10);
  // now we set user password to hashed the password
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create a new USER
  const user = await User.create({ name, email, password: hashedPassword });
  // console.log(user, user.id);
  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } else {
    res.status(400)
    throw new Error("Invalid user data");
  }
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  // Check for the user email
  const user = await User.findOne({ email });

  // check user password with the hashed password stored in the database
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Incorrect email or password");
  }
});

// @desc    Get user data
// @route   POST /api/users/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
  // const { _id, name, email, } = await User.findById(req.user.id)

  // res.status(200).json({
  //     id: _id,
  //     name,
  //     email
  // })

  res.status(200).json(req.user);
});

// @desc    Generating a JWT Token
// @route   generateToken(param)
// @access  Private/Local
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};
