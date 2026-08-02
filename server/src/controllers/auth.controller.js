const { registerSchema } = require("../validators/auth.validator");

const { registerUser } = require("../services/auth.service");

const register = async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const result = await registerUser(validatedData);

    res.status(201).json({
      success: true,

      message: "User registered successfully",

      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,

      message: error.message,
    });
  }
};

const login = async (req, res) => {};

const getProfile = async (req, res) => {};

module.exports = {
  register,
  login,
  getProfile,
};
