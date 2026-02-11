const express = require("express");
const router = express.Router();
const slotController = require("../controllers/slot.controller");
const auditController = require("../controllers/audit.controller");
const dashboardController = require("../controllers/dashboard.controller");
const { requireAuth, requireAdmin } = require("../middlewares/auth.middleware");

router.use(requireAuth);
router.use(requireAdmin);


router.get("/stats", dashboardController.getAdminStats);


router.post("/exam-slots", slotController.createSlot);
router.get("/exam-slots", slotController.getAdminSlots);
router.patch("/exam-slots/:id", slotController.updateSlot);
router.delete("/exam-slots/:id", slotController.deleteSlot);
router.patch("/exam-slots/:id/toggle", slotController.toggleSlotStatus);


router.get("/slots/:id/bookings", slotController.getSlotBookings);
router.delete("/bookings/:id", slotController.adminRemoveBooking);


router.get("/audit-logs", auditController.getAuditLogs);

module.exports = router;
