import { Router } from "express";

import { adminAuth } from "../../middlewares/adminAuth.js";
import { rateLimiter } from "../../middlewares/rateLimiter.js";

import {
  createAlumniCard,
  listAlumniCards,
  getAlumniCard,
  updateAlumniCard,
  deleteAlumniCard,
} from "../../controllers/alumniControllers/alumniCard.controller.js";

const alumniCardRouter = Router();

alumniCardRouter.use(adminAuth);

/* CRUD routes (rate‑limit only the state‑changing ones) */
alumniCardRouter.post("/card/add", rateLimiter, createAlumniCard); // create
alumniCardRouter.get("/", listAlumniCards); // list
alumniCardRouter.get("/:id", getAlumniCard); // read
alumniCardRouter.put("/:id", rateLimiter, updateAlumniCard); // update
alumniCardRouter.delete("/:id", rateLimiter, deleteAlumniCard); // delete

export { alumniCardRouter };
