import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

import { School } from "../../models/School/school.model.js";
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
      alumniName,
      fatherName,
      dob,
      enrollmentNo,
      rollNo,
      email,
      phoneNo,
      school,
      programme,
      branch,
      yearOfPassing,
      // imgOfDegree,
    } = req.body;

    if (
      !alumniName ||
      !fatherName ||
      !email ||
      !enrollmentNo ||
      !rollNo ||
      !school ||
      !programme ||
      !branch ||
      !yearOfPassing
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const findschool = await School.findOne({
      schoolName: school,
      programme,
      branch,
    });
    if (!findschool) {
      return res
        .status(404)
        .json({ message: "School / programme / branch not found" });
    }

    const exists = await Alumni.findOne({
      $or: [{ enrollmentNo }, { phoneNo }, { email }],
    });
    if (exists) {
      return res.status(409).json({ message: "User already registered" });
    }

    await Alumni.create({
      title,
      alumniName: alumniName.trim(),
      fatherName: fatherName?.trim(),
      dob,
      enrollmentNo: enrollmentNo.trim(),
      rollNo: rollNo.trim(),
      email: email.trim().toLowerCase(),
      phoneNo: phoneNo?.trim(),
      schoolId: findschool._id,
      yearOfPassing,
      // imgOfDegree,
      isVerified: false,
    });

    res.status(201).json({ message: "Registration submitted for approval." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
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
    if (!alumni.isActive) {
      return res
        .status(403)
        .json({ message: "Your account has been disabled by GBU " });
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
      sameSite: "none",
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ message: "ok" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
};

export const alumniProfile = async (req, res) => {
  try {
    const alumniId = req.alumniId;

    const alumni = await Alumni.findById(alumniId, {
      credential: 0,
    })
      .populate({
        path: "schoolId",
        select: "schoolName", // select only safe school fields
      })
      .lean();

    if (!alumni) {
      return res.status(400).json({ message: "Alumni not found" });
    }

    // Optionally transform data
    const data = {
      ...alumni,
      schoolName: alumni.schoolId?.schoolName || "N/A",
    };

    res.status(200).json({ entries: data });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
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

export const alumniLogout = async (req, res) => {
  try {
    res
      .clearCookie("alumnitk", {
        httpOnly: true,
        sameSite: "none",
        secure: process.env.NODE_ENV === "production",
      })
      .json({ message: "Alumni logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", err);
    res.status(500).json({ error: "Server Error during logout" });
  }
};

export const updateSocialDetails = async (req, res) => {
  try {
    const alumniId = req.alumni._id;
    const { worksAt, discription, Insta, linkdin, twitter, github, others } =
      req.body;

    if (!worksAt || !discription) {
      return res
        .status(400)
        .json({ message: "worksAt and discription required" });
    }

    const updated = await AlumniSocial.findOneAndUpdate(
      { _id: alumniId },
      {
        worksAt,
        discription,
        Insta,
        linkdin,
        twitter,
        github,
        others,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ message: "Social details updated", entries: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update social details" });
  }
};
