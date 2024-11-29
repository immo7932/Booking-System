const express = require("express");
const {getUserDetails, getBookingDetails} = require("../controllers/Users.js");
const router = express.Router();

router.get("/getUserDetailS/:userId1", getUserDetails);
router.get("/getBookingDetailS/:userId1", getBookingDetails);
module.exports = router;