const express = require("express");

const testRoutes = require("./test.routes");

const customerRoutes = require("./customer.routes");

const router = express.Router();

router.use("/customers", customerRoutes);

router.use("/test", testRoutes);

module.exports = router;
