const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    examId: {
      type: String,
    },

    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExamSlot",
    },

    status: {
      type: String,
      enum: ["SUCCESS", "FAILED", "CANCELLED"],
      required: true,
    },

    reason: {
      type: String,
    },

    requestId: {
      type: String,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);
