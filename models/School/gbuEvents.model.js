import mongoose from "mongoose";

const { Schema, model } = mongoose;

const EventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    venue: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    tags: {
      type: [String],
      default: [], //  ['alumni', 'tech', 'workshop']
    },
    // createdBy: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Admin", // or 'SubAdmin' or 'Alumni' based on your use-case
    //   required: true,
    // },
  },
  {
    collection: "events",
    timestamps: true, // adds createdAt and updatedAt
  }
);

// Export model
export const Event = model("Event", EventSchema);
