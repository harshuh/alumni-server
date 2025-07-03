import mongoose from "mongoose";

//   Establishes a connection to MongoDB using mongoose.

export async function connectDatabase() {
  try {
    await mongoose.connect(process.env.URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error(" MongoDB connection failed:", error.message);
    process.exit(1); // Stop server if DB fails to connect
  }
}
