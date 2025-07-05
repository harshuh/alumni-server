// routes/school/school.router.mjs
import { Router } from "express";
import { adminAuth } from "../../middlewares/adminAuth.js";
import { rateLimiter } from "../../middlewares/rateLimiter.js";

import {
  createSchool,
  listSchools,
  getSchool,
  updateSchool,
  deleteSchool,
} from "../../controllers/schoolControllers/school.controller.js";

const schoolRouter = Router();

schoolRouter.use(adminAuth);

schoolRouter.post("/school/add", rateLimiter, createSchool);
schoolRouter.get("/school/list", listSchools);
schoolRouter.get("/school/:id", getSchool);
schoolRouter.put("/school/:id", rateLimiter, updateSchool);
schoolRouter.delete("/school/:id", rateLimiter, deleteSchool);

export { schoolRouter };
