const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const { premiumReport, claimsReport, customerGrowthReport } = require("../controllers/report.controller");

// All report endpoints are Admin-only
router.get("/premiums", protect, authorize("ADMIN"), premiumReport);
router.get("/claims", protect, authorize("ADMIN"), claimsReport);
router.get("/customers/growth", protect, authorize("ADMIN"), customerGrowthReport);

module.exports = router;
