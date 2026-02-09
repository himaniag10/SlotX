const express = require("express");
const {
    register,
    login,
    logout,
    me,
} = require("../controllers/auth.controller");

const {
    requireAuth,
} = require("../middlewares/auth.middleware");

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/me", requireAuth, me);

module.exports = authRouter;