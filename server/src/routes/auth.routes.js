const express = require("express");

const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");

const {
  register,
  login,
  getProfile,
} = require("../controllers/auth.controller");
const { authorize } = require("../middlewares/role.middleware");

router.get("/profile", protect, getProfile);

router.post("/", protect, authorize("ADMIN,AGENT"), createCustomer);

router.post("/register", register);

router.post("/login", login);

router.get("/profile", getProfile);

module.exports = router;
