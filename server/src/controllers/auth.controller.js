const jwt = require("jsonwebtoken");

const User = require("../models/User");
const TeacherRequest = require("../models/TeacherRequest");

const ApiError = require("../utils/ApiError");
const { hashPassword, comparePassword } = require("../utils/hash");
const { signAccessToken, generateToken } = require("../utils/jwt");

// ─── Register ──────────────────────────────────────────────────────────────
const register = async (req, res, next) => {
  try {
    let { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new ApiError(400, "All fields are required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ApiError(400, "Invalid email format");
    }

    if (password.length < 6) {
      throw new ApiError(400, "Password must be at least 6 characters long");
    }

    email = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, "Email already exists");
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "student",
    });

    const payload = { id: user._id, role: user.role };
    const accessToken = signAccessToken(payload);

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Login ─────────────────────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }

    email = email.toLowerCase().trim();

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      throw new ApiError(401, "Invalid credentials");
    }

    const payload = { id: user._id, role: user.role };
    const accessToken = signAccessToken(payload);

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "Login successful",
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Logout ────────────────────────────────────────────────────────────────
const logout = (req, res, next) => {
  try {
    res.clearCookie("accessToken");
    return res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

// ─── Get Current User ──────────────────────────────────────────────────────
const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res.json(user);
  } catch (error) {
    next(error);
  }
};

// ─── Google OAuth Callback ─────────────────────────────────────────────────
const googleCallback = async (req, res) => {
  try {
    const user = req.user;

    const token = generateToken({
      id: user._id,
      role: user.role,
    });

    res.redirect(
      `${process.env.FRONTEND_LOCAL_URL}/auth/callback?token=${token}&role=${user.role}`
    );
  } catch (err) {
    res.redirect(
      `${process.env.FRONTEND_LOCAL_URL}/login?error=auth_failed`
    );
  }
};

// ─── Request Teacher Role ──────────────────────────────────────────────────
const requestTeacherRole = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.role !== "student") {
      return res.status(400).json({
        message: "Only students can request teacher access.",
      });
    }

    const existing = await TeacherRequest.findOne({ user: userId });

    if (existing) {
      return res.status(400).json({
        message: `You already have a ${existing.status} request.`,
      });
    }

    await TeacherRequest.create({ user: userId });

    res.status(201).json({
      message: "Request submitted. Admin will review it shortly.",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Export ────────────────────────────────────────────────────────────────
module.exports = {
  register,
  login,
  logout,
  me,
  googleCallback,
  requestTeacherRole,
};