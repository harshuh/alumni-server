import mongoose from "mongoose";

// Connects to MongoDB using environment variable URL
export async function connectDatabase() {
  try {
    await mongoose.connect(process.env.URL);
    console.log("--> MongoDB connected successfully.");
  } catch (error) {
    console.error("--> MongoDB connection failed:", error.message);
    process.exit(1); // Exit app on DB connection failure
  }
}
