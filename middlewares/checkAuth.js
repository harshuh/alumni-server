import express from "express";
import { adminAuth, subadminAuth } from "../middlewares/authMiddleware.js";
import { alumniAuth } from "../middlewares/alumniAuth.js";

export const checkRouter = express.Router();

checkRouter.get("/admin-auth", adminAuth, (req, res) => {
  res
    .status(200)
    .json({ message: "Admin authenticated", adminId: req.adminId });
});

checkRouter.get("/subadmin-auth", subadminAuth, (req, res) => {
  res
    .status(200)
    .json({ message: "Subadmin authenticated", subadminId: req.subadminId });
});

checkRouter.get("/alumni-auth", alumniAuth, (req, res) => {
  res
    .status(200)
    .json({ message: "Alumni authenticated", alumniId: req.alumniId });
});
