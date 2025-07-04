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
    enrollmentNumber: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
  },
  {
    collection: "alumnicards",
    timestamps: true,
  }
);
AlumniCardSchema.index({ cardNo: 1, enrollmentNo: 1 }, { unique: true });

export const AlumniCard = model("AlumniCard", AlumniCardSchema);
