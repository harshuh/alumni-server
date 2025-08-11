// routes/adminAuthRoutes/admin.route.mjs
import { Router } from "express";
import { rateLimiter } from "../../middlewares/rateLimiter.js";
import { adminAuth } from "../../middlewares/adminAuth.js";

import {
  adminSignup,
  adminLogin,
  adminProfile,
  adminLogout,
} from "../../controllers/adminControllers/admin.controller.js";

const adminRouter = Router();

adminRouter.post("/signup", adminAuth, adminSignup);
adminRouter.post("/login", rateLimiter, adminLogin); // Limits to 10 requests / 15 min
adminRouter.get("/profile", adminAuth, adminProfile); // Limits to 10 requests / 15 min
adminRouter.post("/logout", adminAuth, adminLogout);
export { adminRouter };
