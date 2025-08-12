import mongoose from "mongoose";

const { Schema, model } = mongoose;

const AlumniSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    alumniName: {
      type: String,
      required: true,
      trim: true,
    },
    fatherName: {
      type: String,
      required: true,
      trim: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    rollNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\d{3}\/[A-Za-z]{2,4}\/\d{3}$/,
        "Invalid rollNo format. Expected: 235/ucs/058",
      ],
    },
    enrollmentNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, // basic email regex
    },
    credential: {
      type: String,
    },
    phoneNo: {
      type: String,
      required: true,
      trim: true,
      match: /^[6-9]\d{9}$/, // 10-digit Indian mobile number
    },
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    yearOfPassing: {
      type: String,
      required: true,
    },
    imgOfDegree: {
      type: String,
      required: true,
    },
    alumnipfp: {
      type: String,
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verified_at: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: "alumni",
    timestamps: true,
  }
);

export const Alumni = model("Alumni", AlumniSchema);
