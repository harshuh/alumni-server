import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Subadmin } from "../../models/Moderator/subadmin.model.js";
import { School } from "../../models/School/school.model.js";

const { SUBADMIN_JWT_SECRET } = process.env;

/*                              Subadmin Sign‑up                               */

export const subadminSignup = async (req, res) => {
  try {
    const schoolName = (req.body.schoolName || "").trim();
    const name = (req.body.name || "").trim();
    const username = (req.body.username || "").trim();
    const credential = (req.body.credential || "").trim();

    if (!schoolName || !name || !username || !credential) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const schoolDoc = await School.findOne({ schoolName });
    if (!schoolDoc) {
      return res.status(400).json({ messages: "Invalid school name" });
    }

    const usernameTaken = await Subadmin.findOne({ username });
    if (usernameTaken) {
      return res
        .status(400)
        .json({ message: "Sub admin with this username already exists" });
    }

    const hashed = await bcrypt.hash(credential, 10);
    await Subadmin.create({
      schoolId: schoolDoc._id,
      name,
      username,
      credential: hashed,
    });

    res.json({ message: "Sub admin account created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

/*                               Subadmin Login                               */

export const subadminLogin = async (req, res) => {
  try {
    const username = (req.body.username || "").trim();
    const credential = (req.body.credential || "").trim();

    if (!username || !credential) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    // constant‑time comparison even if user not found
    const subadmin = await Subadmin.findOne({ username }).lean();
    const storedHash =
      subadmin?.credential ?? "$2b$12$invalidinvalidinvalidinvalidinv";

    const ok = await bcrypt.compare(credential, storedHash);
    if (!subadmin || !ok) {
      return res.status(403).json({ message: "Incorrect credentials" });
    }

    if (!subadmin.isActive) {
      return res.status(403).json({ message: "You are disabled by admin" });
    }
    const token = jwt.sign(
      { id: subadmin._id, role: "subadmin" },
      SUBADMIN_JWT_SECRET,
      { expiresIn: "6h" }
    );

    res
      .cookie("subadmintk", token, {
        httpOnly: true,
        sameSite: "none",
        secure: process.env.NODE_ENV === "production",
        maxAge: 6 * 60 * 60 * 1000,
      })
      .json({ message: "ok" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

/*                               Subadmin Logout                               */
export const subadminLogout = async (req, res) => {
  try {
    res
      .clearCookie("subadmintk", {
        httpOnly: true,
        sameSite: "none",
        secure: process.env.NODE_ENV === "production",
      })
      .json({ message: "Subadmin logged out successfully" });
  } catch (err) {
    console.error("Logout Error:", err);
    res.status(500).json({ error: "Server Error during logout" });
  }
};
