// routes/adminOperations/subAdminOps.route.mjs
import { Router } from "express";
import {
  subAdminList,
  subAdminDelete,
} from "../../controllers/PanelControllers/subAdminOps.controller.js";

const subadminOpsRouter = Router();

subadminOpsRouter.get("/view-subadmins", subAdminList);
subadminOpsRouter.delete("/delete-subadmin/:username", subAdminDelete);

export { subadminOpsRouter };
