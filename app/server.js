import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDatabase } from "../config/connectDB.js";
import { publicCors, restrictedCors } from "../config/cors.config.js";

// Load .env variables
dotenv.config();
// Connect to MongoDB
await connectDatabase();

// Initialize app
const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Route Imports

//Check-Auth
import { checkRouter } from "../middlewares/checkAuth.js";

// Admin & Subadmin Auth
import { adminRouter } from "../routes/adminAuthRoutes/admin.route.js";
import { subadminRouter } from "../routes/adminAuthRoutes/subadmin.route.js";

// Alumni Aut
import { alumniRouter } from "../routes/alumniAuthRoutes/alumni.route.js";

// Admin Operations (subadmin role)
import { operationRouter } from "../routes/adminOperations/subAdminOps.route.js";
import { alumniCardRouter } from "../routes/adminOperations/alumniCard.route.js";
import { alumniApprovalRouter } from "../routes/adminOperations/alumniVerification.route.js";

// School Routes
import { eventRouter } from "../routes/schoolRoutes/event.route.js";
import { schoolRouter } from "../routes/schoolRoutes/school.route.js";

//utils
import { filterRouter } from "../utils/filterData.js";
import { stausRouter } from "../utils/checkStatus.js";

//payU
import { payuRouter } from "../routes/payu.route.js";

// Route Mounting

app.get("/", (req, res) => {
  res.send(" GBU Alumni Portal API Running af");
});

//check-auth

// Auth Routes
app.use("/api/root", restrictedCors, adminRouter);
app.use("/api/subadmin", restrictedCors, subadminRouter);
app.use("/api/alumni", restrictedCors, alumniRouter);

// Admin Operation Routes (Subadmin too)
app.use("/api/panel", restrictedCors, operationRouter);
app.use("/api/alumnicard", restrictedCors, alumniCardRouter);
app.use("/api/approval", restrictedCors, alumniApprovalRouter);

// School/Event/Payment Routes
app.use("/api/events", restrictedCors, eventRouter);
app.use("/api/school", restrictedCors, schoolRouter);

//utils
app.use("/api/data", restrictedCors, filterRouter);
app.use("/api/user", restrictedCors, stausRouter);

//PayU Money
app.use("/api/payment", publicCors, payuRouter);

// auth verification
app.use("/api/members-only", restrictedCors, checkRouter);

// Start Server
const PORT = process.env.PORT;
app.listen(PORT, function (err) {
  if (err) console.log("Error in server setup");
  console.log(`--> Server listening on ${PORT}`);
});
