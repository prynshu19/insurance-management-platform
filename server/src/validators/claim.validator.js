const { z } = require("zod");

const createClaimSchema = z.object({
  policyId: z.string().cuid("Invalid policy ID"),
  claimAmount: z.number().positive("Claim amount must be positive"),
  reason: z.string().min(5, "Reason must be at least 5 characters"),
  description: z.string().optional(),
});

const updateClaimStatusSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "UNDER_REVIEW"]),
  reviewerNote: z.string().optional(),
});

module.exports = { createClaimSchema, updateClaimStatusSchema };
