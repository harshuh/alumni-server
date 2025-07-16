// routes/adminOperations/subAdminOps.route.mjs
import { Router } from "express";
import {
  subAdminList,
  subAdminDelete,
} from "../../controllers/PanelControllers/subAdminOps.controller.js";

const operationRouter = Router();

operationRouter.get("/view-subadmins", subAdminList);
operationRouter.delete("/delete-subadmin/:username", subAdminDelete);

export { operationRouter };
