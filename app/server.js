import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDatabase } from "../config/connectDB.js";

// Load .env variables
dotenv.config();

// Connect to MongoDB
await connectDatabase();

// Initialize app
const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Authorization", "Content-Type", "x-access-token"],
  })
);

// Routes Imports

// Auth
import { adminRouter } from "../routes/adminAuthRoutes/admin.route.js";
import { subadminRouter } from "../routes/adminAuthRoutes/subadmin.route.js";
import { alumniRouter } from "../routes/alumniAuthRoutes/alumni.route.js";

// Admin Panel (Subadmin roles)
import { subadminOpsRouter } from "../routes/adminOperations/subAdminOps.route.js";
import { alumniCardRouter } from "../routes/adminOperations/alumniCard.route.js";
import { alumniApprovalRouter } from "../routes/adminOperations/alumniVerification.route.js";

// Misc
import { schoolRouter } from "../routes/schoolRoutes/school.route.js";
import { filterRouter } from "../utils/filterData.js";

// Health Check
app.get("/", (req, res) => {
  res.send("✅ GBU Alumni Portal API is Running");
});

// API Route Mounting
app.use("/api/root", adminRouter);
app.use("/api/subadmin", subadminRouter);
app.use("/api/alumni", alumniRouter);

app.use("/api/panel", subadminOpsRouter); // Subadmin control panel
app.use("/api/card", alumniCardRouter); // Alumni Card approval
app.use("/api/approval", alumniApprovalRouter); // Alumni approval

app.use("/api/school", schoolRouter); // School-related routes
app.use("/api/utils", filterRouter); // Utility routes

// Start Server

const PORT = process.env.PORT;
app.listen(PORT, function (err) {
  if (err) console.log("Error in server setup");
  console.log(`--> Server listening on ${PORT}`);
});
