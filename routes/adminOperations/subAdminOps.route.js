// routes/adminOperations/subAdminOps.route.mjs
import { Router } from "express";
import {
  subAdminList,
  subAdminDelete,
  getAlumni,
  deleteAlumni,
  toggleSubadminStatus,
  toggleAlumniStatus,
} from "../../controllers/PanelControllers/subAdminOps.controller.js";

const operationRouter = Router();

// Subadmin Tab
operationRouter.get("/view-subadmins", subAdminList);
operationRouter.patch("/toggle/:username", toggleSubadminStatus);
operationRouter.delete("/delete-subadmin/:username", subAdminDelete);

// Alumni Tab
operationRouter.get("/view-alumni", getAlumni);
operationRouter.patch("/alumnitoggle/:enrollmentNo", toggleAlumniStatus);
operationRouter.delete("/delete-alumni/:enrollmentNo", deleteAlumni);

export { operationRouter };
