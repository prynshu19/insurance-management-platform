const express = require("express");
const router = express.Router();

const authRoutes      = require("./auth.routes");
const customerRoutes  = require("./customer.routes");
const policyRoutes    = require("./policy.routes");
const premiumRoutes   = require("./premium.routes");
const claimRoutes     = require("./claim.routes");
const documentRoutes  = require("./document.routes");
const reportRoutes    = require("./report.routes");
const dashboardRoutes = require("./dashboard.routes");

router.use("/auth",      authRoutes);
router.use("/customers", customerRoutes);
router.use("/policies",  policyRoutes);
router.use("/premiums",  premiumRoutes);
router.use("/claims",    claimRoutes);
router.use("/documents", documentRoutes);
router.use("/reports",   reportRoutes);
router.use("/dashboard", dashboardRoutes);

module.exports = router;
