const mongoose = require("mongoose");

const examSlotSchema = new mongoose.Schema(
  {
    examName: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
      index: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    maxCapacity: {
      type: Number,
      required: true,
      min: 1,
    },

    remainingCapacity: {
      type: Number,
      required: true,
    },

    isEnabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

examSlotSchema.index({ examName: 1, date: 1 });

module.exports = mongoose.model("ExamSlot", examSlotSchema);