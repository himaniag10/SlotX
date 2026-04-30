const express = require("express");
const router = express.Router();

const slotController = require("../controllers/slot.controller");
const auditController = require("../controllers/audit.controller");
const dashboardController = require("../controllers/dashboard.controller");
const teacherController = require("../controllers/teacher.controller");

const {
  requireAuth,
  requireRole,
} = require("../middlewares/auth.middleware");

// ─── Protect all routes ───────────────────────────────────────────────────
router.use(requireAuth);

// ─── Admin Only ────────────────────────────────────────────────────────────
router.get("/stats", requireRole("admin"), dashboardController.getAdminStats);
router.get("/teacher-requests", requireRole("admin"), teacherController.getPendingRequests);
router.patch("/teacher-requests/:requestId", requireRole("admin"), teacherController.reviewRequest);
router.get("/audit-logs", requireRole("admin"), auditController.getAuditLogs);

// ─── Admin & Teacher ───────────────────────────────────────────────────────
router.post("/exam-slots", requireRole("admin", "teacher"), slotController.createSlot);
router.get("/exam-slots", requireRole("admin", "teacher"), slotController.getAdminSlots);
router.patch("/exam-slots/:id", requireRole("admin", "teacher"), slotController.updateSlot);
router.delete("/exam-slots/:id", requireRole("admin", "teacher"), slotController.deleteSlot);
router.patch("/exam-slots/:id/toggle", requireRole("admin", "teacher"), slotController.toggleSlotStatus);

// ─── Booking Management (Admin & Teacher) ──────────────────────────────────
router.get("/slots/:id/bookings", requireRole("admin", "teacher"), slotController.getSlotBookings);
router.delete("/bookings/:id", requireRole("admin", "teacher"), slotController.adminRemoveBooking);

// ─── Export ────────────────────────────────────────────────────────────────
module.exports = router;