import { Router } from "express";
import cors from "cors";
import {
  handlePaymentSuccess,
  handlePaymentFailure,
  initiatePayment,
} from "../controllers/payU.controller.js";

export const payuRouter = Router();

// Public CORS (open for all origins)
const publicCors = cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type", "x-access-token"],
});

// --- Public routes ---
payuRouter.post("/success", publicCors, handlePaymentSuccess);
payuRouter.post("/failure", publicCors, handlePaymentFailure);

// --- Restricted routes (inherit from global CORS in server.mjs) ---
payuRouter.post("/initiate-payment", initiatePayment);

// ===========  Harsh's code below  ===========

// import { Router } from "express";
// import express from "express";

// import {
//   handlePaymentSuccess,
//   // handlePaymentFailure,
//   initiatePayment,
// } from "../controllers/payU.controller.js";

// // import { alumniAuth } from "../../middlewares/alumniAuth.js";

// export const payuRouter = Router();
// payuRouter.post(
//   "/success",
//   express.urlencoded({ extended: true }),
//   (req, res) => {
//     try {
//       console.log("✅ /success HIT");
//       console.log("Headers:", req.headers);
//       console.log("Body:", req.body);

//       // Your processing logic here
//       res.status(200).send("Payment success received");
//     } catch (err) {
//       console.error("❌ Error in /success:", err);
//       res.status(500).send("Internal Server Error");
//     }
//   }
// );
// // payuRouter.post("/success", handlePaymentSuccess);
// // payuRouter.post("/failure", handlePaymentFailure);
// payuRouter.post("/initiate-payment", initiatePayment);

// // routes/payu.route.js
// import { Router } from "express";
// import cors from "cors";
// import {
//   handlePaymentSuccess,
//   initiatePayment,
//   handlePaymentFailure,
// } from "../controllers/payU.controller.js";

// // Create router
// export const payuRouter = Router();

// // Public CORS config
// const publicCors = cors({ origin: "*" });

// // ✅ Public routes (PayU can access these freely)
// payuRouter.post("/pay/success", publicCors, handlePaymentSuccess);
// payuRouter.post("/pay/failure", publicCors, handlePaymentFailure);

// // 🔒 Initiate payment (can be protected later)
// payuRouter.post("/pay/:email", initiatePayment);
