const User = require("../models/Users"); // Assuming you have a User model
const Court = require("../models/Courts"); // Adjust the path as necessary
const Booking = require("../models/Bookings");
const mongoose = require("mongoose");
const Centre = require("../models/Centres");
const Sport = require("../models/Sports");
const getAvailableSlots = async (req, res) => {
  const { centre, sport, date } = req.body; // Assuming query parameters are used
  console.log(centre, sport, date);
  try {
    // Find all courts for the specified centre and sport
    const courts = await Court.find({
      sport: new mongoose.Types.ObjectId(sport),
    });

    // Get all bookings for the specified date
    const bookings = await Booking.find({
      centre: new mongoose.Types.ObjectId(centre),
      sport: new mongoose.Types.ObjectId(sport),
      date,
    });
    console.log(bookings);

    // Assuming slots are defined in hours, e.g., from 08:00 to 20:00
    const startHour = 8; // 8 AM
    const endHour = 20; // 8 PM
    const timeSlots = [];

    // Generate time slots with a 1-hour gap for the day
    for (let hour = startHour; hour < endHour; hour++) {
      timeSlots.push(`${hour.toString().padStart(2, "0")}:00`); // Fixed padding
    }

    // Create a map to track booked slots for each court
    const bookedSlotsMap = {};
    bookings.forEach((booking) => {
      const courtId = booking.court.toString();
      if (!bookedSlotsMap[courtId]) {
        bookedSlotsMap[courtId] = new Set(); // Using Set to avoid duplicates
      }
      bookedSlotsMap[courtId].add(booking.startTime);
    });

    // Prepare available slots for each court
    const availableSlotsPerCourt = courts.map((court) => {
      const courtId = court._id.toString();
      const availableSlots = timeSlots.filter(
        (slot) => !bookedSlotsMap[courtId]?.has(slot)
      );

      return {
        court: court,
        availableSlots: availableSlots,
      };
    });

    // Send the result back as a response
    return res.status(200).json({ availableSlotsPerCourt });
  } catch (error) {
    console.error("Error fetching available slots:", error);
    return res.status(500).json({
      message: "Failed to retrieve available slots",
      error: error.message,
    });
  }
};

const createBooking = async (req, res) => {
  const { centre_id, sport_id, court_id, user_id, date, startTime } = req.body;
  console.log(centre_id);
  try {
    if (!isValidStartTime(startTime)) {
      return res
        .status(404)
        .json({ error: "Center will be close at that time." });
    }

    // 1. Check if the centre exists
    const centre = await Centre.findById(centre_id);
    if (!centre) {
      return res.status(404).json({ error: "Centre not found" });
    }

    // 2. Check if the sport exists in the given centre
    const sport = await Sport.findOne({ _id: sport_id, centre: centre_id });
    if (!sport) {
      return res.status(404).json({ error: "Sport not found in this centre" });
    }

    // 3. Check if the court exists for the sport
    const court = await Court.findOne({ _id: court_id, sport: sport_id });
    if (!court) {
      return res
        .status(404)
        .json({ error: "Court not found for the selected sport" });
    }

    // 4. Find the user by user_id
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 5. Calculate endTime based on startTime + 60 minutes
    const endTime = addMinutesToTime(startTime, 60);

    // 6. Check if the requested time slot is already booked (overlapping check)
    const existingBooking = await Booking.findOne({
      court: court_id,
      date: date,
      $or: [
        { startTime: { $lt: endTime, $gte: startTime } }, // Overlaps with start
        { endTime: { $gt: startTime, $lte: endTime } }, // Overlaps with end
        { startTime: { $lte: startTime }, endTime: { $gte: endTime } }, // Fully overlapping
      ],
    });

    if (existingBooking) {
      return res.status(400).json({
        error: "This time slot is already booked for the selected court",
      });
    }

    // 7. Create the booking if the slot is available
    const newBooking = new Booking({
      centre: centre_id,
      sport: sport_id,
      court: court_id,
      date: date,
      startTime: startTime,
      endTime: endTime,
      user: user._id, // Reference the user's ID
    });

    await newBooking.save();

    return res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Server error. Unable to create booking." });
  }
};

const addMinutesToTime = (time, minutesToAdd) => {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes + minutesToAdd);
  const newHours = String(date.getHours()).padStart(2, "0");
  const newMinutes = String(date.getMinutes()).padStart(2, "0");
  return `${newHours}:${newMinutes}`;
};
const isValidStartTime = (startTime) => {
  const [hours, minutes] = startTime.split(":").map(Number);

  // Convert startTime to total minutes for easier comparison
  const startTimeInMinutes = hours * 60 + minutes;

  // Define allowed time range in minutes
  const minTimeInMinutes = 8 * 60; // 08:00 -> 480 minutes
  const maxTimeInMinutes = 20 * 60; // 20:00 -> 1200 minutes

  return (
    startTimeInMinutes >= minTimeInMinutes &&
    startTimeInMinutes < maxTimeInMinutes
  );
};

module.exports = { getAvailableSlots, createBooking };
