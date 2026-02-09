const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    examId: {
      type: String,
      required: true,
      index: true,
    },

    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExamSlot",
      required: true,
    },

    requestId: {
      type: String,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

/*
One booking per student per exam
*/
bookingSchema.index(
  { studentId: 1, examId: 1 },
  { unique: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
