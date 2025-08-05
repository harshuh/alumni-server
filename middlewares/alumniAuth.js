// middlewares/adminAuth.js
import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";
const { ALUMNI_JWT_SECRET } = process.env;

export function alumniAuth(req, res, next) {
  try {
    const token = req.cookies?.alumnitk || null;

    if (!token) {
      return res.status(403).json({ message: "No Alumni token provided." });
    }

    const decoded = jwt.verify(token, ALUMNI_JWT_SECRET);

    if (!decoded?.id) {
      return res
        .status(403)
        .json({ message: "Invalid token. Unauthorized access." });
    }

    req.alumniId = decoded.id;
    next();
  } catch (err) {
    console.error("JWT error:", err.message);
    return res.status(419).json({
      message: "Invalid or expired token. Please log in again.",
    });
  }
}
