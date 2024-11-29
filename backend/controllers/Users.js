const Centres = require("../models/Centres");
const Sports = require("../models/Sports");
const Courts = require("../models/Courts");
const mongoose = require("mongoose");
const Bookings = require("../models/Bookings");
const User = require("../models/Users");
const moment = require("moment");

const getUserDetails = async (req, res) => {
  const UserId1 = req.params.userId1;
  //console.log("s");
  try {
    const user = await User.findById(UserId1);
    // console.log(user)
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user data" });
  }
};


const getBookingDetails = async (req, res) => {
  try {
    const bookings = await Bookings.find({ user: req.params.userId1 })
      .populate({
        path: "centre",
        select: "name location", // Include centre name and location
      })
      .populate({
        path: "sport",
        select: "name", // Include sport name
      })
      .populate({
        path: "court",
        select: "name", // Include court name
      })
      .select("date startTime endTime"); // Include booking date and time details

    const booking = bookings.map((booking) => {
      // Format date to dd/mm/yyyy and include the day of the week
      const date = new Date(booking.date);
      const formattedDate = new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date);

      // Format start and end times to IST (HH:MM AM/PM format)
      const startTimeIST = new Date(
        `1970-01-01T${booking.startTime}:00Z`
      ).toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const endTimeIST = new Date(
        `1970-01-01T${booking.endTime}:00Z`
      ).toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      return {
        centre: booking.centre.name,
        sport: booking.sport.name,
        court: booking.court.name,
        date: formattedDate,
        startTime: startTimeIST,
        endTime: endTimeIST,
      };
    });

    res.json(booking);
  } catch (error) {
    console.error("Error fetching booking details:", error);
    res.status(500).json({ error: "Failed to fetch booking details" });
  }
};

module.exports = { getUserDetails, getBookingDetails };
