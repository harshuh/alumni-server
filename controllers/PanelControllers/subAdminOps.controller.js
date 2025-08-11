import { Alumni } from "../../models/Alumni/alumniData.model.js";
import { Subadmin } from "../../models/Moderator/subadmin.model.js";

// subadmin TAB
export const subAdminList = async (req, res) => {
  try {
    const subadmin = await Subadmin.find(
      {},
      { name: 1, username: 1, isActive: 1 }
    ).populate({
      path: "schoolId",
      select: "schoolName",
    });
    const data = subadmin.map((sa) => ({
      name: sa.name,
      username: sa.username,
      schoolName: sa.schoolId?.schoolName || "N/A",
      status: sa.isActive,
    }));
    res.status(200).json({ entries: data });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error });
  }
};

export const toggleSubadminStatus = async (req, res) => {
  try {
    const username = (req.params.username || "").trim();
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const subadmin = await Subadmin.findOne({ username });
    if (!subadmin) {
      return res.status(404).json({ message: "Subadmin not found" });
    }

    subadmin.isActive = !subadmin.isActive;
    await subadmin.save();

    res.status(200).json({
      message: `Subadmin is now ${subadmin.isActive ? "active" : "disabled"}`,
      isActive: subadmin.isActive,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

export const subAdminDelete = async (req, res) => {
  try {
    const username = (req.params.username || "").trim();
    if (!username) {
      return res.status(400).json({ message: "Username required" });
    }

    const subadminDel = await Subadmin.findOneAndDelete({ username: username });
    if (!subadminDel) {
      res.status(400).json({ message: "Sub Admin Not Found" });
    }
    return res.status(200).json({ message: "Sub Admin deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error });
  }
};
//

// Alumni TAB
export const getAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.find(
      {
        $and: [{ isVerified: true }, { isPaid: true }],
      },
      {
        credential: 0,
      }
    )
      .populate({
        path: "schoolId",
        select: "schoolName programme branch", // select only safe school fields
      })
      .lean();
    const data = alumni.map((a) => ({
      ...a,
      schoolName: a.schoolId?.schoolName || "N/A",
      programme: a.schoolId?.programme || "N/A",
      branch: a.schoolId?.branch || "N/A",
      status: a.isActive,
    }));
    res.status(200).json({ entries: data });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error });
  }
};

export const toggleAlumniStatus = async (req, res) => {
  try {
    const rollNo = (req.params.rollNo || "").trim();
    if (!rollNo) {
      return res.status(400).json({ message: "Roll number is required" });
    }

    const alumni = await Alumni.findOne({ rollNo });
    if (!alumni) {
      return res
        .status(404)
        .json({ message: "Alumni not found (Roll No. Invalid)" });
    }

    alumni.isActive = !alumni.isActive;
    await alumni.save();

    res.status(200).json({
      message: `Alumni is now ${alumni.isActive ? "active" : "disabled"}`,
      isActive: alumni.isActive,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

export const deleteAlumni = async (req, res) => {
  try {
    const enrollmentNo = (req.params.enrollmentNo || "").trim();
    if (!enrollmentNo) {
      return res.status(400).json({ message: "Enrollment Number Required!" });
    }
    const alumni = await Alumni.findOneAndDelete({ enrollmentNo });
    if (!alumni) {
      return res.status(404).json({ message: "Alumni Not Found!" });
    }
    return res.status(200).json({ message: "Alumni Deleted Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};
//
