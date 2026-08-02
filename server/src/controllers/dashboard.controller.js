const { sendSuccess } = require("../utils/ApiResponse");
const { getDashboardStats, getRecentActivities, getMonthlyRevenue } = require("../services/dashboard.service");

const stats = async (req, res, next) => {
  try {
    const data = await getDashboardStats();
    return sendSuccess(res, data, "Dashboard stats retrieved");
  } catch (error) { next(error); }
};

const recentActivities = async (req, res, next) => {
  try {
    const data = await getRecentActivities();
    return sendSuccess(res, data, "Recent activities retrieved");
  } catch (error) { next(error); }
};

const monthlyRevenue = async (req, res, next) => {
  try {
    const data = await getMonthlyRevenue();
    return sendSuccess(res, data, "Monthly revenue retrieved");
  } catch (error) { next(error); }
};

module.exports = { stats, recentActivities, monthlyRevenue };
