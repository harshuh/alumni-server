import { Router } from "express";

import {
  initiatePayment,
  paymentSuccess,
  paymentFailure,
} from "../controllers/payU.controller.js";

// import { alumniAuth } from "../../middlewares/alumniAuth.js";

export const payuRouter = Router();

payuRouter.post("/pay/:email", initiatePayment);
payuRouter.post("/success", paymentSuccess);
payuRouter.post("/failure", paymentFailure);
