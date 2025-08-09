import { Router } from "express";

import {
  initiatePayment,
  paymentSuccess,
  paymentFailure,
} from "../controllers/payU.controller.js";

// import { alumniAuth } from "../../middlewares/alumniAuth.js";

export const payuRouter = Router();

payuRouter.get("/pay/:email", initiatePayment);
payuRouter.post("/pay/success", paymentSuccess);
payuRouter.post("/pay/failure", paymentFailure);
