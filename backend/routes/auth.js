const express = require("express");
const { createUser, loginUser , verifyOtp, resendOtp, forgotPassword, updateNewPassword} = require("../controllers/auth");

const catchAsync = require("../utils/catchAsync");


const router = express.Router();
// Create a new user using: POST /api/auth/createuser "no login required"
router.post("/createuser", createUser);
// authenticate a user using: POST /api/auth/login "no login required"
router.post("/login", loginUser);
router.post("/verifyOtp", verifyOtp);
router.post("/resendOtp", resendOtp);
router.post("/forgotPassword", forgotPassword);
router.post("/updatePassword/:token", updateNewPassword);

// get logged in user details using: POST /api/auth/getuser "login required"

module.exports = router;
