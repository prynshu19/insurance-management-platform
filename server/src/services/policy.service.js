const prisma = require("../lib/prisma");
const ApiError = require("../utils/ApiError");
const { getPaginationParams, getPaginationMeta } = require("../utils/pagination");
const { buildOrderBy, buildSearchWhere, buildDateRangeWhere, mergeWhereConditions } = require("../utils/queryBuilder");

const ALLOWED_SORT_FIELDS = ["policyNumber", "premiumAmount", "startDate", "endDate", "createdAt"];

const createPolicy = async (data) => {
  const customer = await prisma.customer.findFirst({ where: { id: data.customerId, deletedAt: null } });
  if (!customer) throw ApiError.notFound("Customer");

  const existing = await prisma.policy.findUnique({ where: { policyNumber: data.policyNumber } });
  if (existing) throw ApiError.conflict("Policy number already exists");

  return prisma.policy.create({
    data: {
      policyNumber: data.policyNumber,
      policyType: data.policyType,
      description: data.description,
      coverageAmount: data.coverageAmount,
      premiumAmount: data.premiumAmount,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      customerId: data.customerId,
    },
    include: { customer: { select: { id: true, fullName: true } } },
  });
};

const getAllPolicies = async (query = {}) => {
  const { skip, take, page, limit } = getPaginationParams(query);
  const orderBy = buildOrderBy(query, ALLOWED_SORT_FIELDS);
  const searchWhere = buildSearchWhere(query.search, ["policyNumber", "policyType"]);
  const dateWhere = buildDateRangeWhere(query.fromDate, query.toDate, "startDate");

  // Filter by status and type
  const filterWhere = {
    ...(query.status && { status: query.status }),
    ...(query.policyType && { policyType: query.policyType }),
    ...(query.customerId && { customerId: query.customerId }),
  };

  const where = mergeWhereConditions({ deletedAt: null }, filterWhere, searchWhere, dateWhere);

  const [policies, total] = await prisma.$transaction([
    prisma.policy.findMany({
      where, skip, take, orderBy,
      include: {
        customer: { select: { id: true, fullName: true, phone: true } },
        _count: { select: { claims: true, payments: true } },
      },
    }),
    prisma.policy.count({ where }),
  ]);

  return { policies, pagination: getPaginationMeta(total, page, limit) };
};

const getPolicyById = async (id) => {
  const policy = await prisma.policy.findFirst({
    where: { id, deletedAt: null },
    include: {
      customer: { select: { id: true, fullName: true, phone: true, address: true } },
      claims: { orderBy: { createdAt: "desc" }, select: { id: true, claimNumber: true, claimAmount: true, status: true, submissionDate: true } },
      payments: { orderBy: { createdAt: "desc" }, select: { id: true, amount: true, paymentDate: true, paymentStatus: true } },
      _count: { select: { claims: true, payments: true } },
    },
  });

  if (!policy) throw ApiError.notFound("Policy");
  return policy;
};

const updatePolicy = async (id, data) => {
  const policy = await prisma.policy.findFirst({ where: { id, deletedAt: null } });
  if (!policy) throw ApiError.notFound("Policy");

  return prisma.policy.update({
    where: { id },
    data: {
      ...(data.description !== undefined && { description: data.description }),
      ...(data.coverageAmount && { coverageAmount: data.coverageAmount }),
      ...(data.premiumAmount && { premiumAmount: data.premiumAmount }),
      ...(data.startDate && { startDate: new Date(data.startDate) }),
      ...(data.endDate && { endDate: new Date(data.endDate) }),
      ...(data.status && { status: data.status }),
    },
    include: { customer: { select: { id: true, fullName: true } } },
  });
};

// Soft delete
const deletePolicy = async (id) => {
  const policy = await prisma.policy.findFirst({ where: { id, deletedAt: null } });
  if (!policy) throw ApiError.notFound("Policy");

  await prisma.policy.update({ where: { id }, data: { deletedAt: new Date() } });
  return { message: "Policy deleted successfully" };
};

module.exports = { createPolicy, getAllPolicies, getPolicyById, updatePolicy, deletePolicy };
