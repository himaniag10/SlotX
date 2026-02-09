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
      type: String, // "10:00"
      required: true,
    },

    endTime: {
      type: String, // "13:00"
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

// Fast lookup for slots
examSlotSchema.index({ examName: 1, date: 1 });

module.exports = mongoose.model("ExamSlot", examSlotSchema);
