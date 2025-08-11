// import { AlumniCard } from "../../models/Alumni/alumniCard.model.js";

// /*                                                           Create a new card – duplicate check FIRST */
// export const createAlumniCard = async (req, res) => {
//   try {
//     const { alumniId, schoolId, cardNo, enrollmentNo } = req.body;

//     // basic field validation
//     if (!alumniId || !schoolId || !cardNo || !enrollmentNo) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     const dupe = await AlumniCard.findOne({
//       $or: [{ cardNo: cardNo.trim() }, { enrollmentNo: enrollmentNo.trim() }],
//     });
//     if (dupe) {
//       return res
//         .status(409)
//         .json({ error: "Card number or enrollment already exists" });
//     }

//     const newCard = await AlumniCard.create({
//       alumniId,
//       schoolId,
//       cardNo: cardNo.trim(),
//       enrollmentNo: enrollmentNo.trim(),
//     });

//     res.status(201).json({ message: "Alumni card created", card: newCard });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Error creating alumni card" });
//   }
// };

// /*                                                            List Cards       */
// export const listAlumniCards = async (req, res) => {
//   try {
//     const cards = await AlumniCard.find();
//     res.status(200).json(cards);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Error fetching cards" });
//   }
// };

// /*                                                            Get Single Card  */
// export const getAlumniCard = async (req, res) => {
//   try {
//     const card = await AlumniCard.findById(req.params.id);
//     if (!card) return res.status(404).json({ message: "Card not found" });
//     res.status(200).json(card);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Error fetching card" });
//   }
// };

// /*                                                            Update Card      */
// export const updateAlumniCard = async (req, res) => {
//   try {
//     const updated = await AlumniCard.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       {
//         new: true,
//       }
//     );
//     if (!updated) return res.status(404).json({ message: "Card not found" });
//     res.status(200).json({ message: "Alumni card updated", card: updated });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Error updating card" });
//   }
// };

// /*                                                            Delete Card      */
// export const deleteAlumniCard = async (req, res) => {
//   try {
//     const deleted = await AlumniCard.findByIdAndDelete(req.params.id);
//     if (!deleted) return res.status(404).json({ message: "Card not found" });
//     res.status(200).json({ message: "Alumni card deleted" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Error deleting card" });
//   }
// };
