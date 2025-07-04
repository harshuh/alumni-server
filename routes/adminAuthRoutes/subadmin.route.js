import { Router } from "express";

import { adminAuth } from "../../middlewares/adminAuth.js";
import { rateLimiter } from "../../middlewares/rateLimiter.js";

import {
  subadminSignup,
  subadminLogin,
} from "../../controllers/subadmin/subadmin.controller.js";

const subadminRouter = Router();

subadminRouter.post("/subadmin/signup", adminAuth, subadminSignup);
subadminRouter.post("/subadmin/login", rateLimiter, subadminLogin);

export { subadminRouter };
