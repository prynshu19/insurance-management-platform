const { sendSuccess, sendCreated } = require("../utils/ApiResponse");
const {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} = require("../services/customer.service");

const create = async (req, res, next) => {
  try {
    const customer = await createCustomer(req.body);
    return sendCreated(res, customer, "Customer created successfully");
  } catch (error) { next(error); }
};

const getAll = async (req, res, next) => {
  try {
    const { customers, pagination } = await getAllCustomers(req.query);
    return sendSuccess(res, customers, "Customers retrieved successfully", 200, pagination);
  } catch (error) { next(error); }
};

const getById = async (req, res, next) => {
  try {
    const customer = await getCustomerById(req.params.id);
    return sendSuccess(res, customer, "Customer retrieved successfully");
  } catch (error) { next(error); }
};

const update = async (req, res, next) => {
  try {
    const customer = await updateCustomer(req.params.id, req.body);
    return sendSuccess(res, customer, "Customer updated successfully");
  } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
  try {
    const result = await deleteCustomer(req.params.id);
    return sendSuccess(res, null, result.message);
  } catch (error) { next(error); }
};

module.exports = { create, getAll, getById, update, remove };
