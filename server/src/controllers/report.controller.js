const { sendSuccess } = require("../utils/ApiResponse");
const { getPremiumCollectionReport, getClaimsReport, getCustomerGrowthReport } = require("../services/report.service");

const premiumReport = async (req, res, next) => {
  try {
    const data = await getPremiumCollectionReport(req.query);
    return sendSuccess(res, data, "Premium collection report generated");
  } catch (error) { next(error); }
};

const claimsReport = async (req, res, next) => {
  try {
    const data = await getClaimsReport(req.query);
    return sendSuccess(res, data, "Claims report generated");
  } catch (error) { next(error); }
};

const customerGrowthReport = async (req, res, next) => {
  try {
    const data = await getCustomerGrowthReport();
    return sendSuccess(res, data, "Customer growth report generated");
  } catch (error) { next(error); }
};

module.exports = { premiumReport, claimsReport, customerGrowthReport };
