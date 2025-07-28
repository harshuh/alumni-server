// routes/event/event.router.mjs
import { Router } from "express";
// import { adminAuth } from "../../middlewares/adminAuth.js";
import { rateLimiter } from "../../middlewares/rateLimiter.js";

import {
  createEvent,
  listEvents,
  deleteEvent,
  updateEvent,
} from "../../controllers/schoolControllers/event.controller.js";

const eventRouter = Router();

eventRouter.post("/", rateLimiter, createEvent);
eventRouter.get("/", listEvents);
eventRouter.put("/:id", rateLimiter, updateEvent);
eventRouter.delete("/:id", rateLimiter, deleteEvent);

export { eventRouter };
