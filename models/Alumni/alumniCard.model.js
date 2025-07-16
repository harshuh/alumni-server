import mongoose from "mongoose";

const { Schema, model } = mongoose;

/**
 *  alumniId  → references the Alumni (or User) collection
 *  school  → references the School collection
 *  cardNo & enrollmentNumber stay unique to the card itself
 */
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
