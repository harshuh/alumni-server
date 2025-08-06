// middlewares/adminAuth.js
import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";
const { ADMIN_JWT_SECRET, SUBADMIN_JWT_SECRET } = process.env;

export function adminAuth(req, res, next) {
  try {
    // Read from cookie named 'admintk'
    const token = req.cookies?.admintk || null;

    if (!token) {
      return res.status(403).json({ message: "No token provided." });
    }

    const decoded = jwt.verify(token, ADMIN_JWT_SECRET);

    if (!decoded?.id) {
      return res
        .status(403)
        .json({ message: "Invalid token. Unauthorized access." });
    }

    req.adminId = decoded.id; // Attach admin ID to request
    next();
  } catch (err) {
    console.error(" Admin JWT error:", err.message);
    return res.status(419).json({
      message: "Invalid or expired token. Please log in again.",
    });
  }
}

export function subadminAuth(req, res, next) {
  try {
    const token = req.cookies?.subadmintk || null;
    if (!token) {
      return res.status(403).json({ message: "Subadmin token not provided." });
    }

    const decoded = jwt.verify(token, SUBADMIN_JWT_SECRET);
    if (!decoded?.id || decoded.role !== "subadmin") {
      return res.status(403).json({ message: "Unauthorized subadmin access." });
    }

    req.subadminId = decoded.id;
    next();
  } catch (err) {
    console.error("Subadmin JWT error:", err.message);
    return res.status(419).json({
      message: "Invalid or expired subadmin token. Please log in again.",
    });
  }
}
