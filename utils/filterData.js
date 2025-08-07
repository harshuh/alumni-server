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
    const schools = await School.find({}, "schoolName programme branch").lean();

    const result = {};

    for (const { schoolName, programme, branch } of schools) {
      if (!result[schoolName]) {
        result[schoolName] = {};
      }
      if (!result[schoolName][programme]) {
        result[schoolName][programme] = new Set();
      }
      result[schoolName][programme].add(branch);
    }

    for (const school in result) {
      for (const programme in result[school]) {
        result[school][programme] = Array.from(result[school][programme]);
      }
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error("Error building structured school data:", err);
    return res.status(500).json({ error: "Failed to build structure" });
  }
});
