const { sendSuccess, sendCreated } = require("../utils/ApiResponse");
const { submitClaim, getAllClaims, getClaimById, updateClaimStatus, deleteClaim } = require("../services/claim.service");

const submit = async (req, res, next) => {
  try {
    const claim = await submitClaim(req.body);
    return sendCreated(res, claim, "Claim submitted successfully");
  } catch (error) { next(error); }
};

const getAll = async (req, res, next) => {
  try {
    const { claims, pagination } = await getAllClaims(req.query);
    return sendSuccess(res, claims, "Claims retrieved successfully", 200, pagination);
  } catch (error) { next(error); }
};

const getById = async (req, res, next) => {
  try {
    const claim = await getClaimById(req.params.id);
    return sendSuccess(res, claim, "Claim retrieved successfully");
  } catch (error) { next(error); }
};

const updateStatus = async (req, res, next) => {
  try {
    const claim = await updateClaimStatus(req.params.id, req.body);
    return sendSuccess(res, claim, "Claim status updated");
  } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
  try {
    const result = await deleteClaim(req.params.id);
    return sendSuccess(res, null, result.message);
  } catch (error) { next(error); }
};

module.exports = { submit, getAll, getById, updateStatus, remove };
