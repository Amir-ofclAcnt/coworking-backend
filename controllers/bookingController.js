const Booking = require("../models/Booking");
const Room = require("../models/Room");
const express = require("express");
const { protect, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();


const createBooking = async (req, res) => {
  try {
    const { roomId, startTime, endTime } = req.body;

    // Kontrollera dubbelbokning
    const overlap = await Booking.findOne({
      roomId,
      $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }],
    });

    if (overlap) {
      return res
        .status(400)
        .json({ message: "Rummet är redan bokat under den tiden" });
    }

    const booking = await Booking.create({
      roomId,
      userId: req.user.id,
      startTime,
      endTime,
    });

    await booking.populate("roomId");
    await booking.populate("userId");

    const io = req.app.get("io");
    io.emit("bookingUpdate", { type: "created", booking });

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    res.status(400).json({ message: "Kunde inte skapa bokning" });
  }
};

const getBookings = async (req, res) => {
  try {
    const filter = req.user.role === "Admin" ? {} : { userId: req.user.id };

    const bookings = await Booking.find(filter)
      .populate("roomId", "name")
      .populate({ path: "userId", select: "username role" });

    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ message: "Fel vid hämtning av bokningar" });
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("roomId", "name")
      .populate({ path: "userId", select: "username role" });

    if (!booking) {
      return res.status(404).json({ message: "Bokning hittades inte" });
    }

    if (
      booking.userId._id.toString() !== req.user.id &&
      req.user.role !== "Admin"
    ) {
      return res
        .status(403)
        .json({ message: "Inte behörig att se denna bokning" });
    }

    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(400).json({ message: "Kunde inte hämta bokning" });
  }
};

const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking)
      return res.status(404).json({ message: "Bokning hittades inte" });

    if (
      booking.userId.toString() !== req.user.id &&
      req.user.role !== "Admin"
    ) {
      return res
        .status(403)
        .json({ message: "Du får inte ändra denna bokning" });
    }

    Object.assign(booking, req.body);
    await booking.save();

    await booking.populate("roomId");
    await booking.populate("userId");

    const io = req.app.get("io");
    io.emit("bookingUpdate", { type: "updated", booking });

    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(400).json({ message: "Kunde inte uppdatera bokning" });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking)
      return res.status(404).json({ message: "Bokning hittades inte" });

    if (
      booking.userId.toString() !== req.user.id &&
      req.user.role !== "Admin"
    ) {
      return res
        .status(403)
        .json({ message: "Du får inte ta bort denna bokning" });
    }

    await booking.deleteOne();

    const io = req.app.get("io");
    io.emit("bookingUpdate", { type: "deleted", bookingId: booking._id });

    res.json({ message: "Bokning borttagen" });
  } catch (err) {
    res.status(400).json({ message: "Fel vid borttagning av bokning" });
  }
};

const deleteAllBookings = async (req, res) => {
  try {
    await Booking.deleteMany({});
    res.status(200).json({ message: "Alla bokningar har raderats" });
  } catch (error) {
    res.status(500).json({
      message: "Kunde inte radera bokningar",
      error: error.message,
    });
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  deleteAllBookings,
};
