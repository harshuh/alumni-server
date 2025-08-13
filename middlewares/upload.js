import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer storage config for imgOfDegree
const degreeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/degrees"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, "degree-" + ext);
  },
});

// Storage for alumni profile pictures
const alumniPfpStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/pfp"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `pfp-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeType = allowedTypes.test(file.mimetype);
  const extName = allowedTypes.test(ext);
  if (mimeType && extName) return cb(null, true);
  cb(new Error("Only image files (jpeg, jpg, png, webp) are allowed"));
};

export const uploadImgOfDegree = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
}).single("imgOfDegree");

export const uploadImgOfalumni = multer({
  // storage: alumniPfpStorage,
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
}).single("alumnipfp");
