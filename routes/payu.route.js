// import { Router } from "express";

// import {
//   handlePaymentSuccess,
//   initiatePayment,
// } from "../controllers/payU.controller.js";

// // import { alumniAuth } from "../../middlewares/alumniAuth.js";

// export const payuRouter = Router();

// payuRouter.post("/pay/success", handlePaymentSuccess);
// // payuRouter.post("/pay/failure", paymentFailure);
// payuRouter.post("/pay/:email", initiatePayment);

// routes/payu.route.js
import { Router } from "express";
import cors from "cors";
import {
  handlePaymentSuccess,
  initiatePayment,
  handlePaymentFailure,
} from "../controllers/payU.controller.js";

// Create router
export const payuRouter = Router();

// Public CORS config
const publicCors = cors({ origin: "*" });

// ✅ Public routes (PayU can access these freely)
payuRouter.post("/pay/success", publicCors, handlePaymentSuccess);
payuRouter.post("/pay/failure", publicCors, handlePaymentFailure);

// 🔒 Initiate payment (can be protected later)
payuRouter.post("/pay/:email", initiatePayment);
