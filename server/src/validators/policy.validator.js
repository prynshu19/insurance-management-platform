const { z } = require("zod");

const createPolicySchema = z.object({
  policyNumber: z.string().min(3, "Policy number is required"),
  policyType: z.enum(["LIFE", "HEALTH", "AUTO", "HOME", "TRAVEL", "BUSINESS"]),
  description: z.string().optional(),
  coverageAmount: z.number().positive("Coverage amount must be positive"),
  premiumAmount: z.number().positive("Premium amount must be positive"),
  startDate: z.string().refine((v) => !isNaN(Date.parse(v)), { message: "Invalid start date" }),
  endDate: z.string().refine((v) => !isNaN(Date.parse(v)), { message: "Invalid end date" }),
  customerId: z.string().cuid("Invalid customer ID"),
});

const updatePolicySchema = z.object({
  description: z.string().optional(),
  coverageAmount: z.number().positive().optional(),
  premiumAmount: z.number().positive().optional(),
  startDate: z.string().refine((v) => !isNaN(Date.parse(v)), { message: "Invalid start date" }).optional(),
  endDate: z.string().refine((v) => !isNaN(Date.parse(v)), { message: "Invalid end date" }).optional(),
  status: z.enum(["ACTIVE", "EXPIRED", "CANCELLED"]).optional(),
});

module.exports = { createPolicySchema, updatePolicySchema };
