const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// 📌 Hämta alla rum (användare och admin)
router.get('/', protect, roomController.getAllRooms);

// 📌 Hämta ett specifikt rum
router.get('/:id', protect, roomController.getSingleRoom);

// 📌 Skapa nytt rum (endast admin)
router.post('/', protect, isAdmin, roomController.createRoom);

// 📌 Uppdatera rum (endast admin)
router.put('/:id', protect, isAdmin, roomController.updateRoom);

// 📌 Ta bort rum (endast admin)
router.delete('/:id', protect, isAdmin, roomController.deleteRoom);

module.exports = router;
