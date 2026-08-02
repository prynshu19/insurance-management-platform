const { registerUser, loginUser, changePassword } = require("../services/auth.service");
const { registerSchema, loginSchema, changePasswordSchema } = require("../validators/auth.validator");
const { sendSuccess, sendCreated } = require("../utils/ApiResponse");

const register = async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);
    const result = await registerUser(data);
    return sendCreated(res, result, "Account registered successfully");
  } catch (error) { next(error); }
};

const login = async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);
    const result = await loginUser(data);
    return sendSuccess(res, result, "Login successful");
  } catch (error) { next(error); }
};

const getProfile = async (req, res, next) => {
  try {
    const { id, name, email, role } = req.user;
    return sendSuccess(res, { id, name, email, role }, "Profile retrieved successfully");
  } catch (error) { next(error); }
};

const changePasswordController = async (req, res, next) => {
  try {
    const data = changePasswordSchema.parse(req.body);
    const result = await changePassword(req.user.id, data);
    return sendSuccess(res, null, result.message);
  } catch (error) { next(error); }
};

module.exports = { register, login, getProfile, changePasswordController };
