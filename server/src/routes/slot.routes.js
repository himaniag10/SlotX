const express = require("express");
const router = express.Router();
const slotController = require("../controllers/slot.controller");
const { requireAuth, requireAdmin } = require("../middlewares/auth.middleware");

router.use(requireAuth);
router.use(requireAdmin);

router.post("/", slotController.createSlot);
router.get("/", slotController.getAdminSlots);
router.patch("/:id/toggle", slotController.toggleSlotStatus);
router.get("/:id/bookings", slotController.getSlotBookings);

module.exports = router;
