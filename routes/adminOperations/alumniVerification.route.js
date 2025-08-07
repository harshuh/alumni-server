import { Router } from "express";
import { subadminAuth } from "../../middlewares/adminAuth.js";
import {
  listPendingAlumni,
  approveAlumni,
  rejectAlumni,
} from "../../controllers/alumniControllers/alumniVerify.controller.js";

const alumniApprovalRouter = Router();

alumniApprovalRouter.use(subadminAuth);

alumniApprovalRouter.get("/pending-users", listPendingAlumni);
alumniApprovalRouter.post("/approve-user/:enrollmentNo", approveAlumni);
alumniApprovalRouter.delete("/reject-user/:enrollmentNo", rejectAlumni);
export { alumniApprovalRouter };
