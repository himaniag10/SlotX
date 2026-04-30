const mongoose = require("mongoose");

const teacherRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,           // one request per user
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: { type: Date },
    note: { type: String },   // admin can leave a reason for rejection
  },
  { timestamps: true }
);

module.exports = mongoose.model("TeacherRequest", teacherRequestSchema);