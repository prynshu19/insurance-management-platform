const express = require("express");

const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");

const {
  register,
  login,
  getProfile,
} = require("../controllers/auth.controller");

router.get("/profile", protect, getProfile);

router.post("/register", register);

router.post("/login", login);

router.get("/profile", getProfile);

module.exports = router;
