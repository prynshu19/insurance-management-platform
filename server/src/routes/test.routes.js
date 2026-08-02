const express = require("express");
const { testConnection } = require("../controllers/test.controller");

const router = express.Router();

router.get("/", testConnection);

module.exports = router;