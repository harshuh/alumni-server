import { Router } from "express";

import {
  paymentSuccess,
  //   paymentFailure,
  //   initiatePayment,
} from "../controllers/payU.controller.js";

// import { alumniAuth } from "../../middlewares/alumniAuth.js";

export const payuRouter = Router();

payuRouter.get("/pay/success", paymentSuccess);
// payuRouter.get("/pay/failure", paymentFailure);
// payuRouter.post("/pay/:email", initiatePayment);
