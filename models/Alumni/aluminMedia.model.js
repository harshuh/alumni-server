import mongoose from "mongoose";
import { type } from "os";

const { Schema, model } = mongoose;

const urlRegex =
  /^(https?:\/\/)?([\w\-]+\.)+ [\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;

const SocialMediaSchema = new Schema(
  {
    alumniId: {
      type: Schema.Types.ObjectId,
      ref: "alumni",
      required: true,
    },
    worksAt: {
      type: String,
      required: true,
      maxlength: 12,
    },
    discription: {
      type: String,
      required: true,
      maxlength: 500,
    },
    Insta: {
      type: String,
      trim: true,
      match: [urlRegex, "Please enter a valid URL"],
    },
    linkdin: {
      type: String,
      trim: true,
      match: [urlRegex, "Please enter a valid URL"],
    },
    twitter: {
      type: String,
      trim: true,
      match: [urlRegex, "Please enter a valid URL"],
    },
    github: {
      type: String,
      trim: true,
      match: [urlRegex, "Please enter a valid URL"],
    },
    others: {
      type: String,
      trim: true,
      match: [urlRegex, "Please enter a valid URL"],
    },
  },
  {
    collection: "AlumniSocialLinks",
    timestamps: true,
  }
);

export const AlumniSocial = model("AlumniSocialMedia", SocialMediaSchema);
