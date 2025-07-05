import { Router } from "express";

import {
  registerAlumni,
  loginAlumni,
  sendResetLink,
  resetPassword,
} from "../../controllers/alumniControllers/alumni.controller.js";

const alumniRouter = Router();

alumniRouter.post("/alumni/register", registerAlumni);
alumniRouter.post("/alumni/login", loginAlumni);
alumniRouter.post("/alumni/forgot-password", sendResetLink);
alumniRouter.post("/alumni/forgot-password/reset/:token", resetPassword);

export { alumniRouter };
