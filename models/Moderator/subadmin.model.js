import mongoose from "mongoose";

const { Schema, model } = mongoose;

const SubadminSchema = new Schema(
  {
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    credential: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: "subadmins",
    timestamps: true,
  }
);

// Export Mongoose model
export const Subadmin = model("Subadmin", SubadminSchema);
