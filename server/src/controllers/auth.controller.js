const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const TeacherRequest = require("../models/TeacherRequest");
const ApiError = require("../utils/ApiError");
const { hashPassword, comparePassword } = require("../utils/hash");
const { signAccessToken } = require("../utils/jwt");
const sendEmail = require("../utils/mailer");

// ─── Register ──────────────────────────────────────────────────────────────
const register = async (req, res, next) => {
  try {
    let { name, email } = req.body;

    if (!name || !email) {
      throw new ApiError(400, "All fields are required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ApiError(400, "Invalid email format");
    }

    email = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, "Email already exists");
    }

    // Auto-generate a secure random password
    const autoPassword = crypto.randomBytes(4).toString("hex"); // 8 chars
    const hashedPassword = await hashPassword(autoPassword);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "student",
    });

    // Send the password to the user's email
    try {
      await sendEmail({
        email: user.email,
        subject: "SlotX Protocol - Access Credentials",
        message: `Your account has been initialized.\n\nIdentity: ${user.email}\nSecure Pattern: ${autoPassword}\n\nYou can change this pattern at any time via the recovery portal.`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #4F46E5;">Identity Initialized.</h2>
            <p>Your access credentials for the SlotX Protocol have been generated.</p>
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; font-size: 12px; color: #666; text-transform: uppercase;">Universal ID</p>
              <p style="margin: 5px 0 15px 0; font-weight: bold;">${user.email}</p>
              <p style="margin: 0; font-size: 12px; color: #666; text-transform: uppercase;">Access Pattern</p>
              <p style="margin: 5px 0 0 0; font-weight: bold; font-size: 18px; color: #4F46E5;">${autoPassword}</p>
            </div>
            <p style="font-size: 13px; color: #666;">Keep this secure. You can update your pattern via the recovery interface.</p>
          </div>
        `
      });
    } catch (mailErr) {
      console.error("Mail failed:", mailErr);
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

    return res.status(201).json({
      success: true,
      message: "Credentials sent to your email",
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

    const token = signAccessToken({
      id: user._id,
      role: user.role,
    });

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const redirectUrl = process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_SERVER_URL
      : process.env.FRONTEND_LOCAL_URL;

    res.redirect(
      `${redirectUrl}/auth/callback?token=${token}&role=${user.role}`
    );
  } catch (err) {
    const errorRedirectUrl = process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_SERVER_URL
      : process.env.FRONTEND_LOCAL_URL;

    res.redirect(
      `${errorRedirectUrl}/login?error=auth_failed`
    );
  }
};

// ─── Request Teacher Role ──────────────────────────────────────────────────
const requestTeacherRole = async (req, res) => {
  try {
    const userId = req.user.id;

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

// ─── Forgot Password (OTP) ────────────────────────────────────────────────
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) throw new ApiError(400, "Email is required");

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "Identity not found in registry");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save();

    await sendEmail({
      email: user.email,
      subject: "SlotX - Access Recovery",
      message: `Your recovery code: ${otp}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; text-align: center;">
          <h2 style="color: #4F46E5;">Access Recovery.</h2>
          <p>Use the code below to re-initialize your secure pattern.</p>
          <p style="font-size: 32px; font-weight: 900; letter-spacing: 10px; color: #111; margin: 30px 0;">${otp}</p>
          <p style="font-size: 11px; color: #999;">Expired in 10 minutes. If you did not request this, ignore it.</p>
        </div>
      `
    });

    res.json({ success: true, message: "Recovery code sent to email" });
  } catch (error) {
    next(error);
  }
};

// ─── Reset Password ────────────────────────────────────────────────────────
const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) throw new ApiError(400, "Missing required parameters");

    const user = await User.findOne({
      email,
      resetPasswordOTP: otp,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) throw new ApiError(400, "Invalid or expired recovery code");

    user.password = await hashPassword(newPassword);
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ success: true, message: "Pattern updated. Establish new link." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  me,
  googleCallback,
  requestTeacherRole,
  forgotPassword,
  resetPassword,
};