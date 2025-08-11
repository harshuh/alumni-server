import mongoose from "mongoose";

const { Schema, model } = mongoose;

const AlumniCardSchema = new Schema(
  {
    alumniId: {
      type: Schema.Types.ObjectId,
      ref: "Alumni",
      required: true,
    },
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    cardNo: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    issueDate: {
      type: Date,
      default: Date.now, // auto-fill with current date
    },
  },
  {
    collection: "alumnicards",
    timestamps: true,
  }
);
// AlumniCardSchema.index({ cardNo: 1, rollNo: 1 }, { unique: true });

export const AlumniCard = model("AlumniCard", AlumniCardSchema);
