// === routes/roomRoutes.js ===
const express = require("express");
const Room = require("../models/Room");
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Hämta alla rum
router.get("/", async (req, res) => {
  const rooms = await Room.find();
  res.json(rooms);
});

// Skapa nytt rum (Admin)
router.post("/", verifyToken, isAdmin, async (req, res) => {
  const { name, capacity, type } = req.body;
  const newRoom = new Room({ name, capacity, type });
  await newRoom.save();
  res.status(201).json(newRoom);
});

// Uppdatera rum (Admin)
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedRoom);
  } catch (err) {
    res.status(500).json({ message: "Kunde inte uppdatera rum", error: err });
  }
});

// Ta bort rum (Admin)
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: "Rummet är borttaget" });
  } catch (err) {
    res.status(500).json({ message: "Kunde inte ta bort rum", error: err });
  }
});

module.exports = router;
