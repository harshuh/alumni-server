import { Router } from "express";
import { rateLimiter } from "../../middlewares/rateLimiter.js";

import { adminAuth } from "../../middlewares/adminAuth.js";

import {
  listPendingAlumni,
  approveAlumni,
  rejectAlumni,
} from "../../controllers/alumniControllers/alumniVerify.controller.js";

const alumniApprovalRouter = Router();

alumniApprovalRouter.use(adminAuth);

alumniApprovalRouter.get("/pending-users", listPendingAlumni);

alumniApprovalRouter.post("/approve-user", rateLimiter, approveAlumni);

alumniApprovalRouter.delete("/reject-user", rateLimiter, rejectAlumni);

export { alumniApprovalRouter };
