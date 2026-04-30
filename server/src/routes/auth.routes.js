const express = require("express");
const passport = require("../configs/passport");

const {
  register,
  login,
  logout,
  me,
  googleCallback,
  requestTeacherRole,
} = require("../controllers/auth.controller");

const {
  requireAuth, // your existing middleware
  verifyToken, // if separate, else reuse requireAuth
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

// ─── Teacher Role Request ───────────────────────────────────────────────────
authRouter.post("/request-teacher", verifyToken, requestTeacherRole);

// ─── Export ─────────────────────────────────────────────────────────────────
module.exports = authRouter;