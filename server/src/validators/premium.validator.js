const { z } = require("zod");

const createPaymentSchema = z.object({
  policyId: z.string().cuid("Invalid policy ID"),
  amount: z.number().positive("Amount must be positive"),
  dueDate: z.string().refine((v) => !isNaN(Date.parse(v)), { message: "Invalid due date" }).optional(),
  paymentMethod: z.string().optional(),
  transactionId: z.string().optional(),
});

const updatePaymentStatusSchema = z.object({
  paymentStatus: z.enum(["PENDING", "PAID", "OVERDUE", "CANCELLED"]),
  transactionId: z.string().optional(),
  paymentMethod: z.string().optional(),
});

module.exports = { createPaymentSchema, updatePaymentStatusSchema };
