import multer from "multer";
import path from "path";

// Configure storage (same for both images)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "uploads/others";
    if (file.fieldname === "imgOfDegree") folder = "uploads/degrees";
    if (file.fieldname === "alumnipfp") folder = "uploads/pfp";
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

export const uploadAlumniFiles = multer({ storage, fileFilter }).any();
