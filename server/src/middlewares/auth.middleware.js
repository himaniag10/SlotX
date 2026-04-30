const { verifyAccessToken } = require("../utils/jwt");
require("dotenv").config();

// ─── Require Auth (JWT via cookies) ─────────────────────────────────────────
const requireAuth = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ─── Require Admin ──────────────────────────────────────────────────────────
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({
    message: "Forbidden: Admin access required",
  });
};

// ─── Generic Role Middleware (🔥 scalable) ──────────────────────────────────
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied." });
  }
  next();
};

// ─── Export ────────────────────────────────────────────────────────────────
module.exports = {
  requireAuth,
  requireAdmin,
  requireRole,
};