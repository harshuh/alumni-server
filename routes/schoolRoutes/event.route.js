// routes/event/event.router.mjs
import { Router } from "express";
import { adminAuth } from "../../middlewares/adminAuth.js";
import { rateLimiter } from "../../middlewares/rateLimiter.js";

import {
  createEvent,
  listEvents,
  deleteEvent,
} from "../../controllers/schoolControllers/event.controller.js";

const eventRouter = Router();

eventRouter.use(adminAuth);

eventRouter.post("/", rateLimiter, createEvent);
eventRouter.get("/", listEvents);
eventRouter.delete("/:id", rateLimiter, deleteEvent);

export { eventRouter };
