import { Router } from "express";
import { adminAuth } from "../../middlewares/adminAuth.js";

import {
  listPendingAlumni,
  approveAlumni,
  rejectAlumni,
} from "../../controllers/alumniControllers/alumniVerify.controller.js";

const alumniApprovalRouter = Router();

alumniApprovalRouter.use(adminAuth);

alumniApprovalRouter.get("/pending-users", listPendingAlumni);
alumniApprovalRouter.post("/approve/:enrollmentNo", approveAlumni);
alumniApprovalRouter.delete("/reject/:enrollmentNo", rejectAlumni);

export { alumniApprovalRouter };
