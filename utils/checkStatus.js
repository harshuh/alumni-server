import { Router } from "express";
import { Alumni } from "../models/Alumni/alumniData.model.js";

const checkStatus = async (req, res) => {
  try {
    const Email = (req.query.email || "").trim();

    if (!Email) {
      return res.status(400).json({ message: "Email required" });
    }

    const alumni = await Alumni.findOne({ email: Email });

    if (!alumni) {
      return res.status(400).json({ message: "Email Not registered" });
    }

    if (alumni.isVerified && !alumni.isPaid) {
      return res.status(200).json({
        isVerified: alumni.isVerified,
        isPaid: alumni.isPaid,
        message:
          "Your email is verified but payment is pending. Please pay to continue.",
      });
    }

    if (alumni.isVerified && alumni.isPaid) {
      return res.status(200).json({
        isVerified: alumni.isVerified,
        isPaid: alumni.isPaid,
        message: "You can log in now.",
      });
    }

    return res.status(200).json({
      message: "Your email is not verified yet.",
    });
  } catch (error) {
    // console.log("checkStatus:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const stausRouter = Router();

stausRouter.post("/check-status", checkStatus);
