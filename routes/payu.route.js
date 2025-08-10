import { Router } from "express";

import {
  handlePaymentSuccess,
  // handlePaymentFailure,
  initiatePayment,
} from "../controllers/payU.controller.js";

// import { alumniAuth } from "../../middlewares/alumniAuth.js";

export const payuRouter = Router();
payuRouter.post("/success", (req, res) => {
  console.log("🚀 SUCCESS ROUTE HIT — VERCEL CHECK");
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);

  res.status(200).send("Payment success received");
});

// payuRouter.post("/success", handlePaymentSuccess);
// payuRouter.post("/failure", handlePaymentFailure);
payuRouter.post("/initiate-payment", initiatePayment);

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
