const { sendSuccess, sendCreated } = require("../utils/ApiResponse");
const { recordPayment, getPaymentsByPolicy, getOverduePayments, updatePaymentStatus } = require("../services/premium.service");

const create = async (req, res, next) => {
  try {
    const payment = await recordPayment(req.body);
    return sendCreated(res, payment, "Payment recorded successfully");
  } catch (error) { next(error); }
};

const getByPolicy = async (req, res, next) => {
  try {
    const { payments, pagination } = await getPaymentsByPolicy(req.params.policyId, req.query);
    return sendSuccess(res, payments, "Payments retrieved successfully", 200, pagination);
  } catch (error) { next(error); }
};

const getOverdue = async (req, res, next) => {
  try {
    const { payments, pagination } = await getOverduePayments(req.query);
    return sendSuccess(res, payments, "Overdue payments retrieved", 200, pagination);
  } catch (error) { next(error); }
};

const updateStatus = async (req, res, next) => {
  try {
    const payment = await updatePaymentStatus(req.params.id, req.body);
    return sendSuccess(res, payment, "Payment status updated");
  } catch (error) { next(error); }
};

module.exports = { create, getByPolicy, getOverdue, updateStatus };
