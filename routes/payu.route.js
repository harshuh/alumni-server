import { Router } from "express";

import {
  handlePaymentSuccess,
  handlePaymentFailure,
  initiatePayment,
} from "../controllers/payU.controller.js";

// import { alumniAuth } from "../../middlewares/alumniAuth.js";

export const payuRouter = Router();
payuRouter.post("/success", handlePaymentSuccess);
payuRouter.post("/failure", handlePaymentFailure);
payuRouter.post("/initiate-payment", initiatePayment);
