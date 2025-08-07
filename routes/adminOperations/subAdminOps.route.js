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

import { adminAuth, subadminAuth } from "../../middlewares/adminAuth.js";

const operationRouter = Router();

// operationRouter.use(adminAuth);

// Subadmin Tab
operationRouter.get("/view-subadmins", adminAuth, subAdminList);
operationRouter.patch("/toggle/:username", adminAuth, toggleSubadminStatus);
operationRouter.delete("/delete-subadmin/:username", adminAuth, subAdminDelete);

// Alumni Tab
operationRouter.get("/admin/view-alumni", adminAuth, getAlumni);
operationRouter.get("/view-alumni", subadminAuth, getAlumni);
operationRouter.patch(
  "/alumnitoggle/:enrollmentNo",
  adminAuth,
  toggleAlumniStatus
);
operationRouter.delete("/delete-alumni/:enrollmentNo", adminAuth, deleteAlumni);

export { operationRouter };
