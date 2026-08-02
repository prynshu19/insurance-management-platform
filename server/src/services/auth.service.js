const prisma = require("../lib/prisma");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");
const ApiError = require("../utils/ApiError");

const SALT_ROUNDS = 12;

const registerUser = async (data) => {
  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingUser) throw ApiError.conflict("An account with this email already exists");

  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { name: data.name, email: data.email, password: hashedPassword, role: data.role || "CUSTOMER" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  const token = generateToken({ id: user.id, role: user.role });
  return { user, token };
};

const loginUser = async (data) => {
  const user = await prisma.user.findUnique({ where: { email: data.email } });

  // Generic error prevents user enumeration
  if (!user || !user.isActive) throw ApiError.unauthorized("Invalid email or password");

  const isMatch = await bcrypt.compare(data.password, user.password);
  if (!isMatch) throw ApiError.unauthorized("Invalid email or password");

  const token = generateToken({ id: user.id, role: user.role });
  return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token };
};

const changePassword = async (userId, data) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw ApiError.notFound("User");

  const isMatch = await bcrypt.compare(data.currentPassword, user.password);
  if (!isMatch) throw ApiError.badRequest("Current password is incorrect");

  const hashedPassword = await bcrypt.hash(data.newPassword, SALT_ROUNDS);
  await prisma.user.update({ where: { id: userId }, data: { password: hashedPassword } });
  return { message: "Password changed successfully" };
};

module.exports = { registerUser, loginUser, changePassword };
