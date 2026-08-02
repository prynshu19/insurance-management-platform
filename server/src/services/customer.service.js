const prisma = require("../lib/prisma");
const ApiError = require("../utils/ApiError");
const { getPaginationParams, getPaginationMeta } = require("../utils/pagination");
const { buildOrderBy, buildSearchWhere, buildDateRangeWhere, mergeWhereConditions } = require("../utils/queryBuilder");

const ALLOWED_SORT_FIELDS = ["fullName", "phone", "createdAt", "updatedAt"];

const createCustomer = async (data) => {
  const user = await prisma.user.findUnique({ where: { id: data.userId } });
  if (!user) throw ApiError.notFound("User");

  const existing = await prisma.customer.findUnique({ where: { userId: data.userId } });
  if (existing) throw ApiError.conflict("A customer profile already exists for this user");

  return prisma.customer.create({
    data: {
      fullName: data.fullName,
      phone: data.phone,
      dob: new Date(data.dob),
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      userId: data.userId,
    },
    include: { user: { select: { id: true, name: true, email: true, role: true } } },
  });
};

const getAllCustomers = async (query = {}) => {
  const { skip, take, page, limit } = getPaginationParams(query);
  const orderBy = buildOrderBy(query, ALLOWED_SORT_FIELDS);
  const searchWhere = buildSearchWhere(query.search, ["fullName", "phone"]);
  const dateWhere = buildDateRangeWhere(query.fromDate, query.toDate, "createdAt");
  const where = mergeWhereConditions({ deletedAt: null }, searchWhere, dateWhere);

  const [customers, total] = await prisma.$transaction([
    prisma.customer.findMany({
      where, skip, take, orderBy,
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
        _count: { select: { policies: true } },
      },
    }),
    prisma.customer.count({ where }),
  ]);

  return { customers, pagination: getPaginationMeta(total, page, limit) };
};

const getCustomerById = async (id) => {
  const customer = await prisma.customer.findFirst({
    where: { id, deletedAt: null },
    include: {
      user: { select: { id: true, name: true, email: true, role: true } },
      policies: {
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        select: { id: true, policyNumber: true, policyType: true, status: true, premiumAmount: true, startDate: true, endDate: true },
      },
      _count: { select: { policies: true, documents: true } },
    },
  });

  if (!customer) throw ApiError.notFound("Customer");
  return customer;
};

const updateCustomer = async (id, data) => {
  const customer = await prisma.customer.findFirst({ where: { id, deletedAt: null } });
  if (!customer) throw ApiError.notFound("Customer");

  return prisma.customer.update({
    where: { id },
    data: {
      ...(data.fullName && { fullName: data.fullName }),
      ...(data.phone && { phone: data.phone }),
      ...(data.dob && { dob: new Date(data.dob) }),
      ...(data.address && { address: data.address }),
      ...(data.city !== undefined && { city: data.city }),
      ...(data.state !== undefined && { state: data.state }),
      ...(data.zipCode !== undefined && { zipCode: data.zipCode }),
    },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
};

// Soft delete — sets deletedAt instead of removing the record
const deleteCustomer = async (id) => {
  const customer = await prisma.customer.findFirst({ where: { id, deletedAt: null } });
  if (!customer) throw ApiError.notFound("Customer");

  await prisma.customer.update({ where: { id }, data: { deletedAt: new Date() } });
  return { message: "Customer deleted successfully" };
};

module.exports = { createCustomer, getAllCustomers, getCustomerById, updateCustomer, deleteCustomer };
