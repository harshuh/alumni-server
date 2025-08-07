import express from "express";

import { School } from "../models/School/school.model.js";

export const filterRouter = express.Router();

/*
 * Returns:
 * {
 *   SOICT: ["CSE", "IT", "ECE"],
 *   SOM:   ["BBA", "B.Com"]
 * }
 */
filterRouter.get("/filter", async (req, res) => {
  try {
    const schools = await School.find({}, "schoolName programme").lean();
    const result = {};
    for (const { schoolName, programme } of schools) {
      if (!result[schoolName]) {
        result[schoolName] = new Set();
      }
      result[schoolName].add(programme);
    }
    for (const key in result) {
      result[key] = Array.from(result[key]);
    }
    return res.status(200).json(result);
  } catch (err) {
    console.error("Error building structured school data:", err);
    return res.status(500).json({ error: "Failed to build structure" });
  }
});
