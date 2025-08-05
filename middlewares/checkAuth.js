import express from "express";

import { adminAuth } from "../middlewares/adminAuth.js";
import { alumniAuth } from "../middlewares/alumniAuth.js";

export const checkRouter = express.Router();

checkRouter.get("/admin-auth", adminAuth, (req, res) => {
  res.status(200).json({ message: "Authenticated ", adminId: req.adminId });
});
checkRouter.get("/alumni-auth", alumniAuth, (req, res) => {
  res.status(200).json({ message: "Authenticated ", alumniId: req.alumniId });
});
