const express = require("express");
const passport = require("../configs/passport");

const {
  register,
  login,
  logout,
  me,
  googleCallback,
  requestTeacherRole,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller");

const {
  requireAuth,
} = require("../middlewares/auth.middleware");

const authRouter = express.Router();

// ─── Local Auth ─────────────────────────────────────────────────────────────
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/me", requireAuth, me);

// ─── Google OAuth ───────────────────────────────────────────────────────────
authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login?error=failed",
  }),
  googleCallback
);

// ─── Password Recovery ──────────────────────────────────────────────────────
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);

// ─── Teacher Role Request ───────────────────────────────────────────────────
authRouter.post("/request-teacher", requireAuth, requestTeacherRole);

// ─── Export ─────────────────────────────────────────────────────────────────
module.exports = authRouter;