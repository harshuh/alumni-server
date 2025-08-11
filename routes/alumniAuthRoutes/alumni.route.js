// routes/alumniAuthRoutes/alumni.route.mjs
import { Router } from "express";

import { alumniAuth } from "../../middlewares/alumniAuth.js";

import {
  registerAlumni,
  loginAlumni,
  alumniProfile,
  updateProfile,
  changePassword,
  sendResetLink,
  resetPassword,
  alumniLogout,
} from "../../controllers/alumniControllers/alumni.controller.js";

const alumniRouter = Router();

alumniRouter.post("/register", registerAlumni);
alumniRouter.post("/login", loginAlumni);

alumniRouter.get("/profile", alumniAuth, alumniProfile);
alumniRouter.put("/profile/update", alumniAuth, updateProfile);
alumniRouter.post("/profile/change-password", alumniAuth, changePassword);

alumniRouter.post("/forgot-password", sendResetLink);
alumniRouter.post("/forgot-password/reset/:token", resetPassword);

alumniRouter.post("/logout", alumniAuth, alumniLogout);

export { alumniRouter };
