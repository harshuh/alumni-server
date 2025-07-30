// routes/adminAuthRoutes/subadmin.route.mjs
import { Router } from "express";
import { adminAuth } from "../../middlewares/adminAuth.js";
import { rateLimiter } from "../../middlewares/rateLimiter.js";
import {
  subadminSignup,
  subadminLogin,
  subadminLogout,
} from "../../controllers/adminControllers/subadmin.controller.js";

const subadminRouter = Router();

subadminRouter.post("/signup", adminAuth, subadminSignup);
subadminRouter.post("/login", rateLimiter, subadminLogin);
subadminRouter.post("/logout", rateLimiter, subadminLogout);

export { subadminRouter };
