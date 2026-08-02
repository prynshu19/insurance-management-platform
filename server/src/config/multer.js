const multer = require("multer");
const path = require("path");
const { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES } = require("../constants");
const ApiError = require("../utils/ApiError");

// Store files under src/uploads/{category}/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const category = req.query.category || "general";
    cb(null, path.join(__dirname, "../uploads", category));
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(ApiError.badRequest("Invalid file type. Only PDF and images are allowed"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter,
});

module.exports = upload;
