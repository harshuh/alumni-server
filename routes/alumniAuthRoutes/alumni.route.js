// routes/alumniAuthRoutes/alumni.route.mjs
import { Router } from "express";
import {
  registerAlumni,
  loginAlumni,
  sendResetLink,
  resetPassword,
} from "../../controllers/alumniControllers/alumni.controller.js";

const alumniRouter = Router();

alumniRouter.post("/register", registerAlumni);
alumniRouter.post("/login", loginAlumni);
alumniRouter.post("/forgot-password", sendResetLink);
alumniRouter.post("/forgot-password/reset/:token", resetPassword);

export { alumniRouter };
