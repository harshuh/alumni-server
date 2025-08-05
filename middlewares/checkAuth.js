import express from "express";

import { adminAuth } from "../middlewares/adminAuth.js";

export const checkRouter = express.Router();

router.get("/check-auth", adminAuth, (req, res) => {
  res.status(200).json({ message: "Authenticated ", adminId: req.adminId });
});
