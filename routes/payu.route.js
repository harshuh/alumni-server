import { Router } from "express";

import {
  handlePaymentSuccess,
  initiatePayment,
} from "../controllers/payU.controller.js";

// import { alumniAuth } from "../../middlewares/alumniAuth.js";

export const payuRouter = Router();

payuRouter.post("/pay/success", handlePaymentSuccess);
// payuRouter.post("/pay/failure", paymentFailure);
payuRouter.post("/pay/:email", initiatePayment);
