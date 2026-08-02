const prisma = require("../lib/prisma");
const ApiError = require("../utils/ApiError");
const { getPaginationParams, getPaginationMeta } = require("../utils/pagination");
const fs = require("fs");

const uploadDocument = async (file, body) => {
  if (!file) throw ApiError.badRequest("No file uploaded");

  return prisma.document.create({
    data: {
      fileName: file.filename,
      originalName: file.originalname,
      filePath: file.path,
      mimeType: file.mimetype,
      fileSize: file.size,
      fileType: body.fileType || "OTHER",
      ...(body.customerId && { customerId: body.customerId }),
      ...(body.policyId && { policyId: body.policyId }),
      ...(body.claimId && { claimId: body.claimId }),
    },
  });
};

const getDocumentsByCustomer = async (customerId, query = {}) => {
  const { skip, take, page, limit } = getPaginationParams(query);

  const customer = await prisma.customer.findFirst({ where: { id: customerId, deletedAt: null } });
  if (!customer) throw ApiError.notFound("Customer");

  const [documents, total] = await prisma.$transaction([
    prisma.document.findMany({ where: { customerId }, skip, take, orderBy: { createdAt: "desc" } }),
    prisma.document.count({ where: { customerId } }),
  ]);

  return { documents, pagination: getPaginationMeta(total, page, limit) };
};

const getDocumentById = async (id) => {
  const document = await prisma.document.findUnique({ where: { id } });
  if (!document) throw ApiError.notFound("Document");
  return document;
};

const deleteDocument = async (id) => {
  const document = await prisma.document.findUnique({ where: { id } });
  if (!document) throw ApiError.notFound("Document");

  // Remove file from disk
  if (fs.existsSync(document.filePath)) {
    fs.unlinkSync(document.filePath);
  }

  await prisma.document.delete({ where: { id } });
  return { message: "Document deleted successfully" };
};

module.exports = { uploadDocument, getDocumentsByCustomer, getDocumentById, deleteDocument };
