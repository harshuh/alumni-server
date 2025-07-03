// middlewares/adminAuth.js
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const { ADMIN_JWT } = process.env;

/**
 * Verifies the admin JWT and attaches adminId to req.
 * Usage: app.use('/api/admin', adminAuth, adminRouter);
 */
export function adminAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return res.status(403).json({ message: "No token provided." });
    }

    const decoded = jwt.verify(token, ADMIN_JWT);

    if (!decoded?.id) {
      return res
        .status(403)
        .json({ message: "Invalid token.Unauthorized access." });
    }

    req.adminId = decoded.id; // make adminId available downstream
    next();
  } catch (err) {
    console.error("JWT error:", err.message);
    return res.status(419).json({
      message: "Invalid or expired token. Log in again.",
    });
  }
}
