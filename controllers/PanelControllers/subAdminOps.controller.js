import { Subadmin } from "../../models/Moderator/subadmin.model";

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
      res.status(400).json({ message: "Username required" });
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
