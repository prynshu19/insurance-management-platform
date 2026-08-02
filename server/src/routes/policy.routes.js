const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");
const { createPolicySchema, updatePolicySchema } = require("../validators/policy.validator");
const { create, getAll, getById, update, remove } = require("../controllers/policy.controller");

router.post("/", protect, authorize("ADMIN", "AGENT"), validate(createPolicySchema), create);
router.get("/", protect, authorize("ADMIN", "AGENT"), getAll);
router.get("/:id", protect, authorize("ADMIN", "AGENT", "CUSTOMER"), getById);
router.put("/:id", protect, authorize("ADMIN", "AGENT"), validate(updatePolicySchema), update);
router.delete("/:id", protect, authorize("ADMIN"), remove);

module.exports = router;
