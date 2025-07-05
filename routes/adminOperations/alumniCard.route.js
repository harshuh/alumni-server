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
alumniCardRouter.post("/alumni/card/add", rateLimiter, createAlumniCard); // create
alumniCardRouter.get("/alumni", listAlumniCards); // list
alumniCardRouter.get("/alumni/:id", getAlumniCard); // read
alumniCardRouter.put("/alumni/:id", rateLimiter, updateAlumniCard); // update
alumniCardRouter.delete("/alumni/:id", rateLimiter, deleteAlumniCard); // delete

export { alumniCardRouter };
