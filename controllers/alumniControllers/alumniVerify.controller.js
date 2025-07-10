import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

import { Alumni } from "../../models/Alumni/alumniData.model.js";

const { EMAIL, EMAIL_CREDS } = process.env;

/*                            Shared Mail Transporter                         */
const emailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: EMAIL, creds: EMAIL_CREDS },
});

/*                        1. List Pending Alumni Accounts                     */
export const listPendingAlumni = async (req, res) => {
  try {
    const pendingAlumni = await Alumni.find({ isVerified: false }).lean();
    res.json(pendingAlumni);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

/*                          2. Approve an Alumni Account                      */
export const approveAlumni = async (req, res) => {
  try {
    const enrollmentNumber = (req.params.enrollmentNo || "").trim();
    if (!enrollmentNumber) {
      return res.status(400).json({ message: "enrollmentNo required" });
    }

    const alumni = await Alumni.findOne({ enrollmentNo: enrollmentNumber });
    if (!alumni) {
      return res.status(404).json({ message: "User not found" });
    }

    /* Generate a temporary password (replace with a stronger generator in prod) */
    const tempCredential = Math.random().toString(36).slice(-8);
    const hashedTempCredential = await bcrypt.hash(tempCredential, 10);

    alumni.isVerified = true;
    alumni.credential = hashedTempCredential;
    await alumni.save();

    /* Send approval email */
    await emailTransporter.sendMail({
      from: EMAIL,
      to: alumni.email,
      subject: "Your GBU Alumni Account Has Been Approved",
      html: `
        <h2>Congratulations, ${alumni.alumniName || "Alumnus"}!</h2>
        <p>Your registration has been approved.</p>
        <p><strong>Email:</strong> ${alumni.email}</p>
        <p><strong>Temporary Password:</strong> ${tempCredential}</p>
        <p>Please log in and change your password.</p>
      `,
    });

    res.json({ message: "Alumni approved", alumni });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

/*                          3. Reject an Alumni Account                       */
export const rejectAlumni = async (req, res) => {
  try {
    const enrollmentNumber = (req.params.enrollmentNo || "").trim();
    if (!enrollmentNumber) {
      return res.status(400).json({ message: "enrollmentNo required" });
    }

    const alumni = await Alumni.findOneAndDelete({
      enrollmentNo: enrollmentNumber,
    });
    if (!alumni) {
      return res.status(404).json({ message: "User not found" });
    }

    await emailTransporter.sendMail({
      from: EMAIL,
      to: alumni.email,
      subject: "GBU Alumni Registration Rejected",
      html: `
        <h2>Hello, ${alumni.alumniName || "Applicant"}</h2>
        <p>We regret to inform you that your registration was rejected.</p>
        <p>If you believe this is an error, please contact support.</p>
      `,
    });

    res.json({ message: "User rejected and notified" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
