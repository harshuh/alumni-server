// routes/alumniAuthRoutes/alumni.route.mjs
import { Router } from "express";

import { alumniAuth } from "../../middlewares/alumniAuth.js";

import {
  registerAlumni,
  loginAlumni,
  alumniProfile,
  updateSocialDetails,
  sendResetLink,
  resetPassword,
  alumniLogout,
} from "../../controllers/alumniControllers/alumni.controller.js";

const alumniRouter = Router();

alumniRouter.post("/register", registerAlumni);
alumniRouter.post("/login", loginAlumni);
alumniRouter.get("/profile", alumniAuth, alumniProfile);
alumniRouter.put("/profile/update", alumniAuth, updateSocialDetails);
alumniRouter.post("/forgot-password", alumniAuth, sendResetLink);
alumniRouter.post("/forgot-password/reset/:token", resetPassword);
alumniRouter.post("/logout", alumniLogout);

export { alumniRouter };
