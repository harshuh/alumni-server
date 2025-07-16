// routes/adminAuthRoutes/admin.route.mjs
import { Router } from "express";
import { rateLimiter } from "../../middlewares/rateLimiter.js";
import {
  adminSignup,
  adminLogin,
} from "../../controllers/adminControllers/admin.controller.js";

const adminRouter = Router();

adminRouter.post("/signup", adminSignup);
adminRouter.post("/login", rateLimiter, adminLogin); // Limits to 10 requests / 15 min

export { adminRouter };
