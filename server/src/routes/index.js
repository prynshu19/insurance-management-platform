const express = require("express");

const testRoutes = require("./test.routes");

const customerRoutes = require("./customer.routes");

const authRoutes = require("./auth.routes");

const router = express.Router();

route.use("/auth", authRoutes);

router.use("/customers", customerRoutes);

router.use("/test", testRoutes);

module.exports = router;
