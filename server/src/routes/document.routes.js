const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const upload = require("../config/multer");
const { upload: uploadDoc, getByCustomer, getById, remove } = require("../controllers/document.controller");

// Single file upload with multer
router.post("/upload", protect, authorize("ADMIN", "AGENT"), upload.single("file"), uploadDoc);
router.get("/customer/:customerId", protect, authorize("ADMIN", "AGENT"), getByCustomer);
router.get("/:id", protect, authorize("ADMIN", "AGENT", "CUSTOMER"), getById);
router.delete("/:id", protect, authorize("ADMIN"), remove);

module.exports = router;
