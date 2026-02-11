const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.controller");
const dashboardController = require("../controllers/dashboard.controller");
const { requireAuth } = require("../middlewares/auth.middleware");

router.use(requireAuth);

router.get("/stats", dashboardController.getUserStats);
router.get("/activity", dashboardController.getUserActivity);

router.get("/slots/available", bookingController.getAvailableSlots);
router.post("/book-slot", bookingController.bookSlot);
router.get("/my-bookings", bookingController.getMyBookings);
router.delete("/cancel-booking/:id", bookingController.cancelBooking);

module.exports = router;
