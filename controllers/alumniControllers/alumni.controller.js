import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

import { School } from "../../models/School/school.model.js";
import { Alumni } from "../../models/Alumni/alumniData.model.js";
import { formatDate } from "../../utils/dateFormatter.js";

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
    const RollNo = rollNo.trim().toLowerCase();
    const rollNoRegex = /^\d{3}\/[a-z]{3}\/\d{3}$/; // strict pattern
    if (!rollNoRegex.test(RollNo)) {
      return res.status(400).json({
        message: "Invalid rollNo format. Expected format: 235/ucs/058",
      });
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
      rollNo: RollNo.trim(),
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
        select: "schoolName programme branch", // select only safe school fields
      })
      .lean();

    if (!alumni) {
      return res.status(400).json({ message: "Alumni not found" });
    }

    // Optionally transform data
    const data = {
      ...alumni,
      dob: formatDate(alumni.dob),
      schoolName: alumni.schoolId?.schoolName || "N/A",
      programme: alumni.schoolId?.programme || "N/A",
      branch: alumni.schoolId?.branch || "N/A",
    };

    res.status(200).json({ entries: data });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

/* 3. Send Reset Link */
export const sendResetLink = async (req, res) => {
  try {
    const rawEmail = req.body.email || "";
    const email = rawEmail.trim().toLowerCase();

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const alumni = await Alumni.findOne({ email });

    if (!alumni) {
      return res.json({
        message:
          "If the email is registered, a password reset link will be sent.",
      });
    }

    const resetToken = jwt.sign({ id: alumni._id }, JWT_SECRET, {
      expiresIn: "10min",
    });

    const resetLink = `https://alumni-gbu.vercel.app/alumni/forgetPassword/reset/${resetToken}`;

    const htmlEmail = `
  <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">

    <!-- Header with Logo -->
    <div style="text-align: center; padding-bottom: 15px; border-bottom: 1px solid #ddd;">
      <img src="https://alumni-gbu.vercel.app/assets/GBULOGO-DhYKTrkz.png" alt="GBU Logo" style="max-width: 120px; margin-bottom: 10px;">
      <h1 style="color: #2c3e50; margin: 0;">GBU Alumni Association</h1>
    </div>

    <!-- Main Content -->
    <div style="padding: 20px;">
      <h2 style="color: #004aad;">Password Reset Request</h2>
      <p style="font-size: 16px; line-height: 1.5;">
        Dear ${alumni.alumniName || "Alumnus"},
      </p>
      <p style="font-size: 16px; line-height: 1.5;">
        We received a request to reset your password. Click the button below to proceed:
      </p>

      <!-- Reset Button -->
      <div style="text-align: center; margin: 25px 0;">
        <a href="${resetLink}" 
          style="display: inline-block; padding: 12px 20px; background: #004aad; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold;">
          Reset My Password
        </a>
      </div>

      <p style="font-size: 15px; color: #555;">
        This link will expire in <strong>10 minutes</strong> for your security.
      </p>
      <p style="font-size: 15px; color: #555;">
        If you did not request a password reset, you can safely ignore this email.
      </p>
    </div>

    <!-- Footer -->
    <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #ddd; padding-top: 10px;">
      © ${new Date().getFullYear()} GBU Alumni Association. All rights reserved.
    </div>
  </div>
`;

    try {
      await mailer.sendMail({
        from: `"GBU Alumni Portal" <${EMAIL}>`,
        to: email,
        subject: "Password Reset Instructions",
        html: htmlEmail,
      });
    } catch (mailErr) {
      console.error("Mail sending error:", mailErr);
      return res
        .status(500)
        .json({ message: "Failed to send reset email. Try again later." });
    }

    res.json({
      message:
        "If the email is registered, a password reset link has been sent.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while sending reset link" });
  }
};

/* 4. Handle Password Reset */
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newCredential } = req.body;

    // Validate input
    if (!newCredential || typeof newCredential !== "string") {
      return res.status(400).json({ message: "New password is required" });
    }

    // Password strength check
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;
    if (!strongPasswordRegex.test(newCredential)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res
        .status(400)
        .json({ message: "Invalid or expired password reset token" });
    }

    const alumni = await Alumni.findById(decoded.id);
    if (!alumni) {
      return res.status(404).json({ message: "User not found" });
    }

    const hash = await bcrypt.hash(newCredential, 10);

    await Alumni.findByIdAndUpdate(decoded.id, { credential: hash });

    // Log the reset event (can be replaced with DB logs)
    console.log(
      `Password reset for user ${decoded.id} at ${new Date().toISOString()}`
    );

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Password reset error:", err);
    res.status(500).json({ message: "Server error during password reset" });
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
