// controllers/school/school.controller.mjs
import { School } from "../../models/School/school.model.js";

//

/*                                                           Create School    */

export const createSchool = async (req, res) => {
  try {
    const { schoolName, program, branch } = req.body;

    if (!schoolName || !program || !branch) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const dupe = await School.findOne({ schoolName, program, branch });
    if (dupe) {
      return res.status(409).json({
        error: `${schoolName} with this ${branch} already exists in ${program}`,
      });
    }

    await School.create({
      schoolName: schoolName.trim(),
      program: program.trim(),
      branch: branch.trim(),
    });
    res.status(201).json({
      message: `${branch} branch under ${program} has been added to ${schoolName}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating school" });
  }
};

/*                                                            List Schools    */

export const listOfSchools = async (req, res) => {
  try {
    const schools = await School.find(
      {},
      { schoolName: 1, program: 1, branch: 1 }
    );
    res.status(200).json({ data: schools });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching schools" });
  }
};

/*                                                             Get School     */

export const getSchool = async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) return res.status(404).json({ message: "School not found" });
    res.status(200).json({ data: school });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching school" });
  }
};

/*                                                          Update School     */

export const updateSchool = async (req, res) => {
  try {
    const updated = await School.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "School not found" });
    res.status(200).json({ message: "School updated", data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating school" });
  }
};

/*                                                           Delete School     */

export const deleteSchool = async (req, res) => {
  try {
    const deleted = await School.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "School not found" });
    res.status(200).json({ message: "School deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting school" });
  }
};
