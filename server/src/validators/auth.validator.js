const { z } = require("zod");

const registerSchema = z.object({
  email: z.email("Invalid email"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),

  role: z.enum(["ADMIN", "AGENT", "CUSTOMER"]).optional(),
});

module.exports = {
  registerSchema,
};