import { Router } from "express";

import { adminAuth } from "../../middlewares/adminAuth.js";
import {
  subAdminList,
  subAdminDelete,
} from "../../controllers/PanelControllers/subAdminOps.controller.js";

const subadminOpsRouter = Router();

subadminOpsRouter.use(adminAuth);

subadminOpsRouter.get("/viewSubadmin", subAdminList);
subadminOpsRouter.delete("/deleteSubadmin/:username", subAdminDelete);

export { subadminOpsRouter };
