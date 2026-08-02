const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");
const { createPaymentSchema, updatePaymentStatusSchema } = require("../validators/premium.validator");
const { create, getByPolicy, getOverdue, updateStatus } = require("../controllers/premium.controller");

router.post("/", protect, authorize("ADMIN", "AGENT"), validate(createPaymentSchema), create);
router.get("/overdue", protect, authorize("ADMIN", "AGENT"), getOverdue);
router.get("/policy/:policyId", protect, authorize("ADMIN", "AGENT", "CUSTOMER"), getByPolicy);
router.patch("/:id/status", protect, authorize("ADMIN", "AGENT"), validate(updatePaymentStatusSchema), updateStatus);

module.exports = router;
