const Room = require("../models/Room");
const cacheKeys = require("../utils/cacheKeys");
const cacheService = require("../services/cacheService");

exports.createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);
    await cacheService.clearCache(cacheKeys.ROOM_LIST);
    res.status(201).json(room);
  } catch (err) {
    console.error("Create Room Error:", err.message);
    res.status(400).json({ message: "Kunde inte skapa rum" });
  }
};

exports.getAllRooms = async (req, res) => {
  try {
    const cachedRooms = await cacheService.getCache(cacheKeys.ROOM_LIST);

    if (cachedRooms) {
      console.log("➡️ Hämtar rum från cache");
      return res.json(cachedRooms);
    }

    const rooms = await Room.find();
    await cacheService.setCache(cacheKeys.ROOM_LIST, rooms);
    console.log("⬅️ Hämtar rum från DB");
    res.json(rooms);
  } catch (err) {
    console.error("Get Rooms Error:", err.message);
    res.status(500).json({ message: "Fel vid hämtning av rum" });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedRoom) {
      return res.status(404).json({ message: "Rum hittades inte" });
    }

    await cacheService.clearCache(cacheKeys.ROOM_LIST);
    await cacheService.clearCache(cacheKeys.roomKey(req.params.id));

    res.json(updatedRoom);
  } catch (err) {
    console.error("Update Room Error:", err.message);
    res.status(400).json({ message: "Kunde inte uppdatera rum" });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const deleted = await Room.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Rum hittades inte" });
    }

    await cacheService.clearCache(cacheKeys.ROOM_LIST);
    await cacheService.clearCache(cacheKeys.roomKey(req.params.id));

    res.json({ message: "Rummet är borttaget" });
  } catch (err) {
    console.error("Delete Room Error:", err.message);
    res.status(400).json({ message: "Kunde inte ta bort rum" });
  }
};

exports.getSingleRoom = async (req, res) => {
  const roomId = req.params.id;
  const cacheKey = cacheKeys.roomKey(roomId);

  try {
    const cachedRoom = await cacheService.getCache(cacheKey);
    if (cachedRoom) {
      console.log("➡️ Enskilt rum från cache");
      return res.json(cachedRoom);
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Rum hittades inte" });
    }

    await cacheService.setCache(cacheKey, room);
    console.log("⬅️ Enskilt rum från DB");
    res.json(room);
  } catch (err) {
    console.error("Get Single Room Error:", err.message);
    res.status(500).json({ message: "Kunde inte hämta rum" });
  }
};
