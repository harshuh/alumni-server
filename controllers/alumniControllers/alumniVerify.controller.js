import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

import { Alumni } from "../../models/Alumni/alumniData.model.js";

/*                            Shared Mail Transporter                         */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_CREDS,
  },
});

/*                        1. List Pending Alumni Accounts                     */
export const listPendingAlumni = async (req, res) => {
  try {
    const pendingAlumni = await Alumni.find({ isVerified: false })
      .populate({
        path: "schoolId",
        select: "schoolName programme branch",
      })
      .lean();
    const data = pendingAlumni.map((a) => ({
      ...a,
      schoolName: a.schoolId?.schoolName || "N/A",
      status: a.isActive,
    }));
    res.json({ entries: data });
  } catch (error) {
    console.error("Error fetching pending alumni:", error);
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
      return res.status(400).json({ message: "User not found" });
    }

    /* Generate a temporary password (replace with a stronger generator in prod) */
    const tempCredential = Math.random().toString(36).slice(-8);
    // const tempCredential = "10";
    const hashedTempCredential = await bcrypt.hash(tempCredential, 10);

    alumni.isVerified = true;
    alumni.credential = hashedTempCredential;

    await alumni.save();

    /* Send approval email */
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: alumni.email,
      subject: "Your GBU Alumni Account Has Been Approved",
      html: `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
      
      <!-- Header with Logo -->
      <div style="text-align: center; padding-bottom: 15px; border-bottom: 1px solid #ddd;">
        <img src="https://alumni-gbu.vercel.app/assets/GBULOGO-DhYKTrkz.png" alt="GBU Logo" style="max-width: 120px; margin-bottom: 10px;">
        <h1 style="color: #2c3e50; margin: 0;">GBU Alumni Association</h1>
      </div>

      <!-- Main Content -->
      <div style="padding: 20px;">
        <h2 style="color: #27ae60;">Congratulations, ${
          alumni.alumniName || "Alumnus"
        }!</h2>
        <p style="font-size: 16px; line-height: 1.5;">
          We’re excited to inform you that your alumni account has been approved. You can now log in and access all alumni benefits.
        </p>

        <!-- Credentials Box -->
        <div style="background: #fff; padding: 15px; border-radius: 6px; border: 1px solid #ddd; margin-top: 20px;">
          <p style="margin: 8px 0;"><strong>Email:</strong> ${alumni.email}</p>
          <p style="margin: 8px 0;"><strong>Temporary Password:</strong> 
            <span style="background: #eee; padding: 4px 8px; border-radius: 4px; font-weight: bold;">${tempCredential}</span>
          </p>
        </div>

        <p style="margin-top: 20px; font-size: 15px;">
          For your security, please log in and change your password immediately.
        </p>

        <!-- Login Button -->
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://alumni-gbu.vercel.app/alumni/login" 
            style="display: inline-block; padding: 10px 20px; background: #27ae60; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Log In Now
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #ddd; padding-top: 10px;">
        © ${new Date().getFullYear()} GBU Alumni Association. All rights reserved.
      </div>
    </div>
  `,
    });

    res.json({ message: "Alumni approved", alumni });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error });
  }
};

export const approvedAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.find(
      {
        $and: [{ isVerified: true }, { isPaid: false }],
      },
      {
        credential: 0,
      }
    )
      .populate({
        path: "schoolId",
        select: "schoolName programme branch",
      })
      .lean();
    const data = alumni.map((a) => ({
      ...a,
      schoolName: a.schoolId?.schoolName || "N/A",
      status: a.isActive,
    }));

    res.status(200).json({ entries: data });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error });
  }
};

/*                          3. Reject an Alumni Account                       */
export const rejectAlumni = async (req, res) => {
  try {
    const enrollmentNumber = (req.params.enrollmentNo || "").trim();
    if (!enrollmentNumber) {
      return res.status(400).json({ message: "EnrollmentNo required" });
    }
    const { rejectReason } = req.body;
    if (!rejectReason) {
      return res.status(400).json({ message: "Reason required" });
    }

    const alumni = await Alumni.findOneAndDelete({
      enrollmentNo: enrollmentNumber,
    });
    if (!alumni) {
      return res.status(404).json({ message: "User not found" });
    }

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: alumni.email,
      subject: "GBU Alumni Registration Rejected",
      html: `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
      
      <!-- Header with Logo -->
      <div style="text-align: center; padding-bottom: 15px; border-bottom: 1px solid #ddd;">
        <img src="https://alumni-gbu.vercel.app/assets/GBULOGO-DhYKTrkz.png" alt="GBU Logo" style="max-width: 120px; margin-bottom: 10px;">
        <h1 style="color: #2c3e50; margin: 0;">GBU Alumni Association</h1>
      </div>

      <!-- Main Content -->
      <div style="padding: 20px;">
        <h2 style="color: #e74c3c;">Dear ${
          alumni.alumniName || "Applicant"
        },</h2>
        <p style="font-size: 16px; line-height: 1.5;">
          We regret to inform you that your alumni registration has been rejected.
        </p>

        <!-- Reason Box -->
        <div style="background: #fff3f3; padding: 15px; border-radius: 6px; border: 1px solid #e0b4b4; margin-top: 20px;">
          <p style="margin: 8px 0; color: #c0392b;"><strong>Reason for Rejection:</strong></p>
          <p style="margin: 8px 0; font-size: 15px; color: #333;">${rejectReason}</p>
        </div>

        <p style="margin-top: 20px; font-size: 15px;">
          If you believe this was a mistake or you wish to appeal, please contact our alumni support team.
        </p>

        <!-- Contact Support Button -->
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://alumni-gbu.vercel.app/alumni/contact" 
            style="display: inline-block; padding: 10px 20px; background: #e74c3c; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Contact Support
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #ddd; padding-top: 10px;">
        © ${new Date().getFullYear()} GBU Alumni Association. All rights reserved.
      </div>
    </div>
  `,
    });

    res.json({ message: "User rejected and notified" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
