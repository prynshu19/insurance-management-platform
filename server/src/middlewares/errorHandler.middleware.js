const { ZodError } = require("zod");
const { Prisma } = require("@prisma/client");
const ApiError = require("../utils/ApiError");

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Operational errors we threw intentionally
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ success: false, message: err.message, errors: err.errors });
  }

  // Zod validation failures
  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => ({ field: e.path.join("."), message: e.message }));
    return res.status(400).json({ success: false, message: "Validation failed", errors });
  }

  // Prisma known errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const field = err.meta?.target?.join(", ") || "field";
      return res.status(409).json({ success: false, message: `A record with this ${field} already exists`, errors: [] });
    }
    if (err.code === "P2025") {
      return res.status(404).json({ success: false, message: err.meta?.cause || "Record not found", errors: [] });
    }
    if (err.code === "P2003") {
      return res.status(400).json({ success: false, message: "Related resource not found", errors: [] });
    }
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") return res.status(401).json({ success: false, message: "Invalid token", errors: [] });
  if (err.name === "TokenExpiredError") return res.status(401).json({ success: false, message: "Token expired", errors: [] });

  // Unknown errors
  console.error("[ERROR]", err);
  return res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === "production" ? "Something went wrong" : err.message,
    errors: [],
  });
};

module.exports = errorHandler;
