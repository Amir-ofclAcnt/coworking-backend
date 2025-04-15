const express = require("express");
const router = express.Router();
const { deleteUser, getAllUsers } = require("../controllers/userController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

router.delete("/:id", protect, isAdmin, deleteUser);
router.get("/", protect, isAdmin, getAllUsers);

module.exports = router;
