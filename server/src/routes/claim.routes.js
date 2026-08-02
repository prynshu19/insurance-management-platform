const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");
const { createClaimSchema, updateClaimStatusSchema } = require("../validators/claim.validator");
const { submit, getAll, getById, updateStatus, remove } = require("../controllers/claim.controller");

router.post("/", protect, authorize("ADMIN", "AGENT", "CUSTOMER"), validate(createClaimSchema), submit);
router.get("/", protect, authorize("ADMIN", "AGENT"), getAll);
router.get("/:id", protect, authorize("ADMIN", "AGENT", "CUSTOMER"), getById);
router.patch("/:id/status", protect, authorize("ADMIN", "AGENT"), validate(updateClaimStatusSchema), updateStatus);
router.delete("/:id", protect, authorize("ADMIN"), remove);

module.exports = router;
