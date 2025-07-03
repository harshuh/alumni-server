import mongoose from "mongoose";

const { Schema, model } = mongoose;

const AdminSchema = new Schema(
  {
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
  },
  {
    collection: "admins",
    timestamps: true,
  }
);

// Export the compiled model
export const Admin = model("Admin", AdminSchema);
