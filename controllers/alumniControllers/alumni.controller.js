import jwt from "jsonwebtoken";

import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

import { Alumni } from "../../models/Alumni/alumniData.model.js";

const { ALUMNI_JWT_SECRET, JWT_SECRET, EMAIL, EMAIL_CREDS, FRONTEND_URL } =
  process.env;

/* Shared Email Transporter */
const mailer = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: { user: EMAIL, pass: EMAIL_CREDS },
});

/* 1. Register Alumni */
export const registerAlumni = async (req, res) => {
  try {
    const {
      title,
      dob,
      alumniName,
      email,
      phone,
      fathersName,
      enrollmentNo,
      rollNo,
      schoolId,
      programme,
      yearOfPassing,
    } = req.body;

    if (!alumniName || !email || !enrollmentNo || !rollNo || !schoolId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const exists = await Alumni.findOne({
      $or: [{ enrollmentNo }, { rollNo }, { email }],
    });
    if (exists) {
      return res.status(409).json({ error: "User already registered" });
    }

    await Alumni.create({
      title,
      dob,
      alumniName: alumniName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim(),
      fathersName,
      enrollmentNo: enrollmentNo.trim(),
      rollNo: rollNo.trim(),
      schoolId,
      programme,
      yearOfPassing,
      isVerified: false,
    });

    res.status(201).json({ message: "Registration submitted for approval." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
};

/* 2. Alumni Login */
export const loginAlumni = async (req, res) => {
  try {
    const email = (req.body.email || "").trim().toLowerCase();
    const credential = (req.body.credential || "").trim();

    const alumni = await Alumni.findOne({ email });
    if (!alumni) {
      return res.status(403).json({ message: "Invalid credentials" });
    }

    if (!alumni.isVerified) {
      return res.status(403).json({ message: "Account pending verification" });
    }

    const valid = await bcrypt.compare(credential, alumni.credential || "");
    if (!valid) {
      return res.status(403).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: alumni._id }, ALUMNI_JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("alumnitk", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ message: "ok" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
};

/* 3. Send Reset Link */
export const sendResetLink = async (req, res) => {
  try {
    const email = (req.body.email || "").trim().toLowerCase();
    const alumni = await Alumni.findOne({ email });

    if (!alumni)
      return res.status(404).json({ message: "Email not registered" });

    const resetToken = jwt.sign({ id: alumni._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    const resetLink = `${FRONTEND_URL}/reset-password/${resetToken}`;

    await mailer.sendMail({
      from: EMAIL,
      to: email,
      subject: "GBU Alumni Portal - Password Reset",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });

    res.json({ message: "Reset link sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send reset link" });
  }
};

/* 4. Handle Password Reset */
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newCredential } = req.body;

    const decoded = jwt.verify(token, JWT_SECRET);
    const hash = await bcrypt.hash(newCredential, 10);

    await Alumni.findByIdAndUpdate(decoded.id, { credential: hash });

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};
