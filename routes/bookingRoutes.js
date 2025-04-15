const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

router.post("/", protect, bookingController.createBooking);
router.get("/", protect, bookingController.getBookings);
router.get("/:id", protect, bookingController.getBookingById);
router.put("/:id", protect, bookingController.updateBooking);
router.delete("/:id", protect, bookingController.deleteBooking);
router.delete("/", protect, isAdmin, bookingController.deleteAllBookings);


module.exports = router;
