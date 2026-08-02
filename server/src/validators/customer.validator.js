const { z } = require("zod");

// ─── Create Customer ──────────────────────────────────────────────────────────
const createCustomerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(150),
  phone: z
    .string()
    .regex(/^\+?[0-9]{7,15}$/, "Invalid phone number format"),
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date of birth",
  }),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  // userId must be provided so that Admin/Agent can link to an existing user account
  userId: z.string().cuid("Invalid user ID"),
});

// ─── Update Customer ──────────────────────────────────────────────────────────
const updateCustomerSchema = z.object({
  fullName: z.string().min(2).max(150).optional(),
  phone: z
    .string()
    .regex(/^\+?[0-9]{7,15}$/, "Invalid phone number format")
    .optional(),
  dob: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" })
    .optional(),
  address: z.string().min(5).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
});

module.exports = {
  createCustomerSchema,
  updateCustomerSchema,
};
