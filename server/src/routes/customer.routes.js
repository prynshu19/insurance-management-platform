const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");
const { createCustomerSchema, updateCustomerSchema } = require("../validators/customer.validator");
const { create, getAll, getById, update, remove } = require("../controllers/customer.controller");

// Admin and Agent can create/update/delete; all authenticated users can view
router.post("/", protect, authorize("ADMIN", "AGENT"), validate(createCustomerSchema), create);
router.get("/", protect, authorize("ADMIN", "AGENT"), getAll);
router.get("/:id", protect, authorize("ADMIN", "AGENT"), getById);
router.put("/:id", protect, authorize("ADMIN", "AGENT"), validate(updateCustomerSchema), update);
router.delete("/:id", protect, authorize("ADMIN"), remove);

module.exports = router;
