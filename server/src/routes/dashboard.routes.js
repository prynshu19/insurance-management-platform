const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const { stats, recentActivities, monthlyRevenue } = require("../controllers/dashboard.controller");

router.get("/stats", protect, authorize("ADMIN", "AGENT"), stats);
router.get("/activities", protect, authorize("ADMIN", "AGENT"), recentActivities);
router.get("/revenue", protect, authorize("ADMIN"), monthlyRevenue);

module.exports = router;
