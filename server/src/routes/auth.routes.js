const express = require("express");

const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");
const {
  register,
  login,
  getProfile,
  changePasswordController,
} = require("../controllers/auth.controller");

// ─── Public Routes ────────────────────────────────────────────────────────────
router.post("/register", register);
router.post("/login", login);

// ─── Protected Routes ─────────────────────────────────────────────────────────
router.get("/profile", protect, getProfile);
router.put("/change-password", protect, changePasswordController);

module.exports = router;
