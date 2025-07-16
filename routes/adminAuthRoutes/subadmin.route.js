// routes/adminAuthRoutes/subadmin.route.mjs
import { Router } from "express";
import { adminAuth } from "../../middlewares/adminAuth.js";
import { rateLimiter } from "../../middlewares/rateLimiter.js";
import {
  subadminSignup,
  subadminLogin,
} from "../../controllers/adminControllers/subadmin.controller.js";

const subadminRouter = Router();

subadminRouter.post("/signup", adminAuth, subadminSignup); // Admin creates subadmin
subadminRouter.post("/login", rateLimiter, subadminLogin);

export { subadminRouter };
