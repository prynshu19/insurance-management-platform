const { sendSuccess, sendCreated } = require("../utils/ApiResponse");
const { createPolicy, getAllPolicies, getPolicyById, updatePolicy, deletePolicy } = require("../services/policy.service");

const create = async (req, res, next) => {
  try {
    const policy = await createPolicy(req.body);
    return sendCreated(res, policy, "Policy created successfully");
  } catch (error) { next(error); }
};

const getAll = async (req, res, next) => {
  try {
    const { policies, pagination } = await getAllPolicies(req.query);
    return sendSuccess(res, policies, "Policies retrieved successfully", 200, pagination);
  } catch (error) { next(error); }
};

const getById = async (req, res, next) => {
  try {
    const policy = await getPolicyById(req.params.id);
    return sendSuccess(res, policy, "Policy retrieved successfully");
  } catch (error) { next(error); }
};

const update = async (req, res, next) => {
  try {
    const policy = await updatePolicy(req.params.id, req.body);
    return sendSuccess(res, policy, "Policy updated successfully");
  } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
  try {
    const result = await deletePolicy(req.params.id);
    return sendSuccess(res, null, result.message);
  } catch (error) { next(error); }
};

module.exports = { create, getAll, getById, update, remove };
