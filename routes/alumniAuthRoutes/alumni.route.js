// routes/alumniAuthRoutes/alumni.route.mjs
import { Router } from "express";

import { alumniAuth } from "../../middlewares/alumniAuth.js";

import {
  registerAlumni,
  loginAlumni,
  updateSocialDetails,
  sendResetLink,
  resetPassword,
  alumniLogout,
} from "../../controllers/alumniControllers/alumni.controller.js";

const alumniRouter = Router();

alumniRouter.post("/register", registerAlumni);
alumniRouter.post("/login", loginAlumni);
alumniRouter.put("/profile/update", alumniAuth, updateSocialDetails);
alumniRouter.post("/forgot-password", alumniAuth, sendResetLink);
alumniRouter.post("/forgot-password/reset/:token", resetPassword);
alumniRouter.post("/logout", alumniAuth, alumniLogout);

export { alumniRouter };
