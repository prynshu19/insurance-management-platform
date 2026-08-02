// Send a successful JSON response
const sendSuccess = (res, data, message = "Success", statusCode = 200, pagination = null) => {
  const response = { success: true, message, data };
  if (pagination) response.pagination = pagination;
  return res.status(statusCode).json(response);
};

// Send a 201 Created response
const sendCreated = (res, data, message = "Resource created successfully") => {
  return sendSuccess(res, data, message, 201);
};

module.exports = { sendSuccess, sendCreated };
