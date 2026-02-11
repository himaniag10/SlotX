const express = require("express");
const router = express.Router();
const auditController = require("../controllers/audit.controller");
const { requireAuth, requireAdmin } = require("../middlewares/auth.middleware");

router.use(requireAuth);
router.use(requireAdmin);

router.get("/", auditController.getAuditLogs);

module.exports = router;
