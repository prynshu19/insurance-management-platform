const { sendSuccess, sendCreated } = require("../utils/ApiResponse");
const { uploadDocument, getDocumentsByCustomer, getDocumentById, deleteDocument } = require("../services/document.service");

const upload = async (req, res, next) => {
  try {
    const document = await uploadDocument(req.file, req.body);
    return sendCreated(res, document, "Document uploaded successfully");
  } catch (error) { next(error); }
};

const getByCustomer = async (req, res, next) => {
  try {
    const { documents, pagination } = await getDocumentsByCustomer(req.params.customerId, req.query);
    return sendSuccess(res, documents, "Documents retrieved successfully", 200, pagination);
  } catch (error) { next(error); }
};

const getById = async (req, res, next) => {
  try {
    const document = await getDocumentById(req.params.id);
    return sendSuccess(res, document, "Document retrieved successfully");
  } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
  try {
    const result = await deleteDocument(req.params.id);
    return sendSuccess(res, null, result.message);
  } catch (error) { next(error); }
};

module.exports = { upload, getByCustomer, getById, remove };
