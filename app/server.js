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
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "https://alumni-gbu.vercel.app",
  "http://localhost:5173",
  "https://test.payu.in/_payment",
  "https://secure.payu.in",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type", "x-access-token"],
  })
);

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
app.use("/api/root", adminRouter);
app.use("/api/subadmin", subadminRouter);
app.use("/api/alumni", alumniRouter);

// Admin Operation Routes (Subadmin too)
app.use("/api/panel", operationRouter);
app.use("/api/alumnicard", alumniCardRouter);
app.use("/api/approval", alumniApprovalRouter);

// School/Event/Payment Routes
app.use("/api/events", eventRouter);
app.use("/api/school", schoolRouter);

//utils
app.use("/api/data", filterRouter);
app.use("/api/user", stausRouter);

//PayU Money
app.use("/api/payu", payuRouter);

// auth verification
app.use("/api/members-only", checkRouter);

// Start Server
const PORT = process.env.PORT;

app.listen(PORT, function (err) {
  if (err) console.log("Error in server setup");

  console.log(`--> Server listening on ${PORT}`);
});
