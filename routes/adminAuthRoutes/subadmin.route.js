// routes/adminAuthRoutes/subadmin.route.mjs
import { Router } from "express";
import { adminAuth, subadminAuth } from "../../middlewares/adminAuth.js";
import { rateLimiter } from "../../middlewares/rateLimiter.js";
import {
  subadminSignup,
  subadminLogin,
  subadminProfile,
  subadminLogout,
} from "../../controllers/adminControllers/subadmin.controller.js";

const subadminRouter = Router();

subadminRouter.post("/signup", adminAuth, subadminSignup);
subadminRouter.post("/login", rateLimiter, subadminLogin);
subadminRouter.get("/profile", subadminAuth, subadminProfile);
subadminRouter.post("/logout", subadminAuth, subadminLogout);

export { subadminRouter };
