// === routes/users.js ===
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// GET /api/users - Hämta alla användare (Admin)
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exkludera lösenord
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Kunde inte hämta användare', error: err });
  }
});

// DELETE /api/users/:id - Ta bort en användare (Admin)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Användare borttagen' });
  } catch (err) {
    res.status(500).json({ message: 'Kunde inte ta bort användare', error: err });
  }
});

module.exports = router;
