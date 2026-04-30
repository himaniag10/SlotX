import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name:       { type: String, required: true },
    email:      { type: String, required: true, unique: true },
    password:   { type: String },                    // optional now (Google users won't have it)
    googleId:   { type: String, sparse: true },      // only for Google users
    avatar:     { type: String },                    // Google profile picture

    role: {
      type: String,
      enum: ["admin", "teacher", "student"],
      default: "student",
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);