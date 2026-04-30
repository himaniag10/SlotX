const express = require("express");
const router = express.Router();

const slotController = require("../controllers/slot.controller");
const auditController = require("../controllers/audit.controller");
const dashboardController = require("../controllers/dashboard.controller");
const teacherController = require("../controllers/teacher.controller");

const {
  requireAuth,
  requireAdmin,
} = require("../middlewares/auth.middleware");

// ─── Protect all admin routes ───────────────────────────────────────────────
router.use(requireAuth);
router.use(requireAdmin);

// ─── Dashboard ─────────────────────────────────────────────────────────────
router.get("/stats", dashboardController.getAdminStats);

// ─── Slot Management ───────────────────────────────────────────────────────
router.post("/exam-slots", slotController.createSlot);
router.get("/exam-slots", slotController.getAdminSlots);
router.patch("/exam-slots/:id", slotController.updateSlot);
router.delete("/exam-slots/:id", slotController.deleteSlot);
router.patch("/exam-slots/:id/toggle", slotController.toggleSlotStatus);

// ─── Booking Management ────────────────────────────────────────────────────
router.get("/slots/:id/bookings", slotController.getSlotBookings);
router.delete("/bookings/:id", slotController.adminRemoveBooking);

// ─── Teacher Requests  ─────────────────────────────────────────────
router.get("/teacher-requests", teacherController.getPendingRequests);
router.patch("/teacher-requests/:requestId", teacherController.reviewRequest);

// ─── Audit Logs ────────────────────────────────────────────────────────────
router.get("/audit-logs", auditController.getAuditLogs);

// ─── Export ────────────────────────────────────────────────────────────────
module.exports = router;