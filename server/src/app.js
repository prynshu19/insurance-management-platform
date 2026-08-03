require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const compression = require("compression");
const { rateLimit } = require("express-rate-limit");
const path = require("path");
const fs = require("fs");

const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler.middleware");

const app = express();

// ─── Security Middleware ───────────────────────────────────────────────────────
app.use(helmet()); // Secure HTTP headers

// CORS — allow requests from the configured client origin
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

// ─── Rate Limiting ─────────────────────────────────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes",
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts, please try again after 15 minutes",
  },
});

app.use("/api", apiLimiter);
app.use("/api/v1/auth", authLimiter);

// ─── Request Parsing ───────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─── Response Compression ─────────────────────────────────────────────────────
app.use(compression());

// ─── HTTP Request Logger ───────────────────────────────────────────────────────
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// ─── Health Check ──────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Insurance Management Platform API is running",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ────────────────────────────────────────────────────────────────
app.use("/api/v1", routes);

// ─── Serve React Frontend Build (for full-stack production deployments) ────────
const clientBuildPath = path.join(__dirname, "../../client/dist");
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));

  app.get(/(.*)/, (req, res, next) => {
    if (req.originalUrl.startsWith("/api") || req.originalUrl.startsWith("/health")) {
      return next();
    }
    res.sendFile(path.join(clientBuildPath, "index.html"), (err) => {
      if (err) next(err);
    });
  });
}

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ─── Global Error Handler (must be last) ──────────────────────────────────────
app.use(errorHandler);

module.exports = app;
