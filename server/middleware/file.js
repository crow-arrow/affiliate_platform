import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const userId = req.user.id || "default";
    const ext = path.extname(file.originalname);
    const filename = `UserId-${userId}-${Date.now()}${ext}`;
    cb(null, filename);
  },
});

const types = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
const fileFilter = (req, file, cb) => {
  if (types.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export default multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
