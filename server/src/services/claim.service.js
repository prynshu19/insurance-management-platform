const prisma = require("../lib/prisma");
const ApiError = require("../utils/ApiError");
const { getPaginationParams, getPaginationMeta } = require("../utils/pagination");
const { buildOrderBy, buildDateRangeWhere, mergeWhereConditions } = require("../utils/queryBuilder");

const ALLOWED_SORT_FIELDS = ["claimAmount", "submissionDate", "createdAt"];

const submitClaim = async (data) => {
  const policy = await prisma.policy.findFirst({ where: { id: data.policyId, deletedAt: null } });
  if (!policy) throw ApiError.notFound("Policy");

  // Only active policies can be claimed
  if (policy.status !== "ACTIVE") throw ApiError.badRequest("Claims can only be submitted for active policies");

  return prisma.claim.create({
    data: {
      policyId: data.policyId,
      claimAmount: data.claimAmount,
      reason: data.reason,
      description: data.description,
    },
    include: { policy: { select: { id: true, policyNumber: true, policyType: true } } },
  });
};

const getAllClaims = async (query = {}) => {
  const { skip, take, page, limit } = getPaginationParams(query);
  const orderBy = buildOrderBy(query, ALLOWED_SORT_FIELDS);
  const dateWhere = buildDateRangeWhere(query.fromDate, query.toDate, "submissionDate");

  const filterWhere = {
    ...(query.status && { status: query.status }),
    ...(query.policyId && { policyId: query.policyId }),
  };

  const where = mergeWhereConditions(filterWhere, dateWhere);

  const [claims, total] = await prisma.$transaction([
    prisma.claim.findMany({
      where, skip, take, orderBy,
      include: {
        policy: { select: { id: true, policyNumber: true, policyType: true, customer: { select: { id: true, fullName: true } } } },
        _count: { select: { documents: true } },
      },
    }),
    prisma.claim.count({ where }),
  ]);

  return { claims, pagination: getPaginationMeta(total, page, limit) };
};

const getClaimById = async (id) => {
  const claim = await prisma.claim.findUnique({
    where: { id },
    include: {
      policy: { select: { id: true, policyNumber: true, policyType: true, customer: { select: { id: true, fullName: true, phone: true } } } },
      documents: true,
    },
  });

  if (!claim) throw ApiError.notFound("Claim");
  return claim;
};

const updateClaimStatus = async (id, data) => {
  const claim = await prisma.claim.findUnique({ where: { id } });
  if (!claim) throw ApiError.notFound("Claim");

  return prisma.claim.update({
    where: { id },
    data: {
      status: data.status,
      reviewerNote: data.reviewerNote,
      // Set resolvedDate when claim is finalized
      ...(["APPROVED", "REJECTED"].includes(data.status) && { resolvedDate: new Date() }),
    },
  });
};

const deleteClaim = async (id) => {
  const claim = await prisma.claim.findUnique({ where: { id } });
  if (!claim) throw ApiError.notFound("Claim");

  // Only PENDING claims can be deleted
  if (claim.status !== "PENDING") throw ApiError.badRequest("Only pending claims can be deleted");

  await prisma.claim.delete({ where: { id } });
  return { message: "Claim deleted successfully" };
};

module.exports = { submitClaim, getAllClaims, getClaimById, updateClaimStatus, deleteClaim };
