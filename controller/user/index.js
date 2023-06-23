const catchAsyncError = require("../../middleware/catchAsyncError");
const User = require("../../model/user/index");
const ErrorHandler = require("../../utils/errorHandler");
const sendToken = require("../../utils/jwtToken");
const bcrypt = require("bcryptjs");
const { serialize } = require("cookie");
const twilio = require("twilio");
const { createHash } = require("crypto");
const nodemailer = require("nodemailer");
const { multer } = require("multer");

//Register User
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

 
  const user = await User.create({
    name, email, password
  });

  sendToken(user, 201, res);
});


//Login User

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  //check if user has  given password and email both

  if (!email || !password) {
    return res.status(400).json("please enter Email & Password");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({ message: "Invalid email and password" });
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (isPasswordMatched) {
    // Passwords match, authentication successful
    sendToken(user, 200, res);
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

// get all register User

exports.getAllRegisterUser = async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
};

// Logout User

exports.logoutUser = catchAsyncError(async (req, res, next) => {
  const cookieOptions = {
    path: "/",
    httpOnly: true,
    expires: new Date(0), 
  };
  const cookieValue = serialize("token", "", cookieOptions);
  res.setHeader("Set-Cookie", cookieValue);

  res.status(200).json({ success: true, message: "Signout successful" });
});
