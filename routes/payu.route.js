import { Router } from "express";

import {
  initiatePayment,
  paymentSuccess,
  paymentFailure,
} from "../controllers/payU.controller.js";

// import { alumniAuth } from "../../middlewares/alumniAuth.js";

export const payuRouter = Router();

payuRouter.get("/pay/success", paymentSuccess);
payuRouter.get("/pay/failure", paymentFailure);
payuRouter.post("/payment/:email", initiatePayment);
