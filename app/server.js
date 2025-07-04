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

// Route Imports

// Admin & Subadmin Auth
import { adminRouter } from "../routes/adminAuthRoutes/admin.route.js";
import { subadminRouter } from "../routes/adminAuthRoutes/subadmin.route.js";

// Alumni Auth
import { alumniRouter } from "../routes/alumniAuthRoutes/alumni.route.js";

// Admin Operations (subadmin role)
import { alumniCardRouter } from "../routes/adminOperations/alumniCard.route.js";
import { alumniApprovalRouter } from "../routes/adminOperations/alumniVerification.route.js";

// School Routes
import { schoolRouter } from "../routes/schoolRoutes/school.route.js";

// Route Mounting

app.get("/", (_req, res) => {
  res.send(" GBU Alumni Portal API Running af");
});

// Auth Routes
app.use("/api/", adminRouter);
app.use("/api/", subadminRouter);
app.use("/api/", alumniRouter);

// Admin Operation Routes (Subadmin too)
app.use("/api/", alumniCardRouter);
app.use("/api/", alumniApprovalRouter);

// School/Event/Payment Routes
app.use("/api/admin/school", schoolRouter);

// Start Server

const PORT = process.env.PORT || 1212;
app.listen(PORT, () => {
  console.log(`--> Server listening on http://localhost:${PORT}`);
});
