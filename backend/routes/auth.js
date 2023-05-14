const router = require("express").Router();
const {
  register,
  login,
  forgotPassword,
  sendOtp,
  resetPassword,
  refresh,
  checkMobileandEmail,
} = require("../Controllers/UserControllers");
const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // if this line of code is put below client , client wont work
const serviceID = process.env.TWILIO_serviceID;
const accountSID = process.env.TWILIO_accountSID;
const authToken = process.env.TWILIO_token;
const client = require("twilio")(accountSID, authToken);

// RIGISTER
router.post("/register", register);

// Check Mobile and Email
router.post("/check-mobile", checkMobileandEmail);

// FORGOT PASSWORD
router.post("/forgot_password", forgotPassword);

//LOGIN
router.post("/login", login);

// RESET PASSWORD
router.post("/reset_password", resetPassword);

// refresh
router.get("/refresh", refresh );

module.exports = router; // 29-03-2023 : when i give this router in an object, it shows a type error saying that the router is recieved in the app.use as an object
