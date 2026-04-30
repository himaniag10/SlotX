const TeacherRequest = require("../models/TeacherRequest");
const User = require("../models/User");
const nodemailer = require("nodemailer");

// ─── Mail Transporter ───────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS, // Use App Password (important)
  },
});

// ─── Send Email Helper ──────────────────────────────────────────────────────
const sendEmail = async (to, subject, html) => {
  return transporter.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject,
    html,
  });
};

// ─── GET: All Pending Teacher Requests ──────────────────────────────────────
const getPendingRequests = async (req, res, next) => {
  try {
    const requests = await TeacherRequest.find({ status: "pending" })
      .populate("user", "name email avatar createdAt")
      .sort({ createdAt: -1 });

    return res.json(requests);
  } catch (error) {
    next(error);
  }
};

// ─── PATCH: Approve / Reject Request ────────────────────────────────────────
const reviewRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const { action, note = "" } = req.body; // "approve" | "reject"

    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({ message: "Invalid action." });
    }

    const request = await TeacherRequest.findById(requestId).populate("user");

    if (!request) {
      return res.status(404).json({ message: "Request not found." });
    }

    // Update request
    request.status = action === "approve" ? "approved" : "rejected";
    request.reviewedBy = req.user._id;
    request.reviewedAt = new Date();
    request.note = note;

    await request.save();

    // ─── If Approved ────────────────────────────────────────────────────────
    if (action === "approve") {
      await User.findByIdAndUpdate(request.user._id, {
        role: "teacher",
      });

      await sendEmail(
        request.user.email,
        "🎉 You're now a Teacher on SlotX!",
        `
        <h2>Hi ${request.user.name},</h2>
        <p>Your teacher access has been <strong>approved</strong>.</p>
        <p>You can now log in and access your Teacher Dashboard.</p>
        <a href="${process.env.FRONTEND_LOCAL_URL}/login">Login to SlotX</a>
        `
      );
    }

    // ─── If Rejected ────────────────────────────────────────────────────────
    else {
      await sendEmail(
        request.user.email,
        "SlotX Teacher Request Update",
        `
        <h2>Hi ${request.user.name},</h2>
        <p>Your teacher access request was <strong>not approved</strong>.</p>
        ${note ? `<p><strong>Reason:</strong> ${note}</p>` : ""}
        <p>Contact your admin for more info.</p>
        `
      );
    }

    return res.json({
      message: `Request ${request.status} successfully.`,
    });

  } catch (error) {
    next(error);
  }
};

// ─── Export ────────────────────────────────────────────────────────────────
module.exports = {
  getPendingRequests,
  reviewRequest,
};