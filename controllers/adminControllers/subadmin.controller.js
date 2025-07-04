import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Subadmin } from "../../models/Moderator/subadmin.model.js";

const { ADMIN_JWT_SECRET } = process.env;

/*                              Subadmin Sign‑up                               */

export const subadminSignup = async (req, res) => {
  try {
    const name = (req.body.name || "").trim();
    const username = (req.body.username || "").trim();
    const credential = (req.body.credential || "").trim();

    if (!name || !username || !credential) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const usernameTaken = await Subadmin.findOne({ username });
    if (usernameTaken) {
      return res
        .status(400)
        .json({ error: "Sub admin with this username already exists" });
    }

    const hashed = await bcrypt.hash(credential, 10);
    await Subadmin.create({ name, username, credential: hashed });

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

    const token = jwt.sign(
      { id: subadmin._id, role: "subadmin" }, // include role
      ADMIN_JWT_SECRET,
      { expiresIn: "6h" }
    );

    res
      .cookie("subadmintk", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 6 * 60 * 60 * 1000, // 6 hours
      })
      .json({ message: "ok" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};
