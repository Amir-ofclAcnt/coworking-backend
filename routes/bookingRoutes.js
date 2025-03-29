const express = require("express");
const Booking = require("../models/Booking");
const Room = require("../models/Room");
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

// POST /bookings - create a booking
router.post("/", verifyToken, async (req, res) => {
  try {
    const { roomId, startTime, endTime } = req.body;

    // Kontrollera att rummet finns
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });

    // Kontrollera dubbelbokning
    const overlappingBooking = await Booking.findOne({
      roomId,
      $or: [
        { startTime: { $lt: new Date(endTime), $gte: new Date(startTime) } },
        { endTime: { $gt: new Date(startTime), $lte: new Date(endTime) } },
        {
          startTime: { $lte: new Date(startTime) },
          endTime: { $gte: new Date(endTime) },
        },
      ],
    });
    if (overlappingBooking)
      return res
        .status(409)
        .json({ message: "Room is already booked for the selected time." });

    const newBooking = new Booking({
      roomId,
      userId: req.user.id,
      startTime,
      endTime,
    });
    await newBooking.save();

    // Notifiera via Socket.io
    const io = req.app.get("io");
    io.emit("bookingCreated", newBooking);

    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: "Failed to create booking", error });
  }
});

// GET /bookings - get user bookings (or all if admin)
router.get("/", verifyToken, async (req, res) => {
  try {
    const query = req.user.role === "Admin" ? {} : { userId: req.user.id };
    const bookings = await Booking.find(query).populate("roomId");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings", error });
  }
});

// PUT /bookings/:id - update booking (owner or admin only)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (
      req.user.id !== booking.userId.toString() &&
      req.user.role !== "Admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this booking" });
    }

    // Kontrollera dubbelbokning vid uppdatering
    const { startTime, endTime } = req.body;
    const overlappingBooking = await Booking.findOne({
      _id: { $ne: booking._id },
      roomId: booking.roomId,
      $or: [
        { startTime: { $lt: new Date(endTime), $gte: new Date(startTime) } },
        { endTime: { $gt: new Date(startTime), $lte: new Date(endTime) } },
        {
          startTime: { $lte: new Date(startTime) },
          endTime: { $gte: new Date(endTime) },
        },
      ],
    });
    if (overlappingBooking)
      return res
        .status(409)
        .json({ message: "Room is already booked for the selected time." });

    booking.startTime = startTime;
    booking.endTime = endTime;
    await booking.save();

    const io = req.app.get("io");
    io.emit("bookingUpdated", booking);

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Failed to update booking", error });
  }
});

// DELETE /bookings/:id - delete booking (owner or admin only)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (
      req.user.id !== booking.userId.toString() &&
      req.user.role !== "Admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this booking" });
    }

    await booking.deleteOne();

    const io = req.app.get("io");
    io.emit("bookingDeleted", { id: req.params.id });

    res.json({ message: "Booking deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete booking", error });
  }
});

module.exports = router;
