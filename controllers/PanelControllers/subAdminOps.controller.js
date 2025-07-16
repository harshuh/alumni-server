import { Alumni } from "../../models/Alumni/alumniData.model.js";
import { Subadmin } from "../../models/Moderator/subadmin.model.js";

// subadmin TAB
export const subAdminList = async (req, res) => {
  try {
    const subadmin = await Subadmin.find({}, { name: 1, username: 1 }).populate(
      {
        path: "schoolId",
        select: "schoolName",
      }
    );
    const data = subadmin.map((sa) => ({
      name: sa.name,
      username: sa.username,
      schoolName: sa.schoolId?.schoolName || "N/A",
    }));
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error });
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
    const alumni = await Alumni.find({}, "-_id");
    res.status(200).json(alumni);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error });
  }
};
export const deleteAlumni = async (req, res) => {
  try {
    const enrollmentNo = (req.params.enrollmentNo || "").trim();
    if (!enrollmentNo) {
      return res.status(400).json({ message: "Enrollment Number Required!" });
    }
    const alumni = await Alumni.findByIdAndDelete({
      enrollmentNo: enrollmentNo,
    });
    if (!alumni) {
      return res.status(400).json({ message: "Alumni Not Found!!" });
    }
    return res.status(200).json({ message: "Alumni Deleted Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error ", error: error });
  }
};
//
