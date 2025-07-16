import { Router } from "express";
import { adminAuth } from "../../middlewares/adminAuth.js";
import { rateLimiter } from "../../middlewares/rateLimiter.js";

import {
  createSchool,
  listOfSchools,
  getSchool,
  updateSchool,
  deleteSchool,
} from "../../controllers/schoolControllers/school.controller.js";

const schoolRouter = Router();

schoolRouter.use(adminAuth);

schoolRouter.post("/add", rateLimiter, createSchool);
schoolRouter.get("/", listOfSchools);
schoolRouter.get("/:id", getSchool);
schoolRouter.put("/:id", rateLimiter, updateSchool);
schoolRouter.delete("/:id", rateLimiter, deleteSchool);

export { schoolRouter };
