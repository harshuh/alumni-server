import mongoose from "mongoose";

const { Schema, model } = mongoose;

const SchoolSchema = new Schema(
  {
    schoolName: {
      type: String,
      required: true,
      trim: true,
    },
    program: {
      type: String,
      required: true,
      trim: true,
    },
    branch: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    collection: "schools",
    timestamps: true,
  }
);

// Prevent duplicate entries with same name + program + branch
SchoolSchema.index({ schoolName: 1, program: 1, branch: 1 }, { unique: true });

export const School = model("School", SchoolSchema);
