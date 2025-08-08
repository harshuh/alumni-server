import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { Admin } from "../../models/Admin/admin.model.js";
const { ADMIN_JWT_SECRET } = process.env;

/*      Admin Signup        */
export const adminSignup = async (req, res) => {
  try {
    const name = (req.body.name || "").trim();
    const username = (req.body.username || "").trim();
    const credential = (req.body.credential || "").trim();

    if (!name || !username || !credential) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const exists = await Admin.findOne({ username });
    if (exists) {
      return res
        .status(400)
        .json({ error: "Admin with this username already exists" });
    }

    const hashed = await bcrypt.hash(credential, 10);
    await Admin.create({ name, username, credential: hashed });

    res.json({ message: "Admin account created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

/*      Admin Login     */
export const adminLogin = async (req, res) => {
  try {
    const username = (req.body.username || "").trim();
    const credential = (req.body.credential || "").trim();

    if (!username || !credential) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    // Constant‑time behaviour: always hash‑compare even if user not found
    const admin = await Admin.findOne({ username }).lean();
    const storedHash =
      admin?.credential ?? "$2b$12$invalidinvalidinvalidinvalidinv";
    const ok = await bcrypt.compare(credential, storedHash);

    if (!admin || !ok) {
      return res.status(403).json({ message: "Incorrect credentials" });
    }

    const token = jwt.sign({ id: admin._id, role: "admin" }, ADMIN_JWT_SECRET, {
      expiresIn: "1m",
    });

    res
      .cookie("admintk", token, {
        httpOnly: true,
        sameSite: "none",
        secure: process.env.NODE_ENV === "production",
        maxAge: 1 * 60 * 1000, // 1 minutes for admin
      })
      .json({ message: "ok" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

/*      Admin Logout      */
export const adminLogout = async (req, res) => {
  try {
    res
      .clearCookie("admintk", {
        httpOnly: true,
        sameSite: "none",
        secure: process.env.NODE_ENV === "production",
      })
      .json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};
