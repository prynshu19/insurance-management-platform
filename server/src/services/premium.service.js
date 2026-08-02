const prisma = require("../lib/prisma");
const ApiError = require("../utils/ApiError");
const { getPaginationParams, getPaginationMeta } = require("../utils/pagination");

const recordPayment = async (data) => {
  const policy = await prisma.policy.findFirst({ where: { id: data.policyId, deletedAt: null } });
  if (!policy) throw ApiError.notFound("Policy");

  return prisma.premiumPayment.create({
    data: {
      policyId: data.policyId,
      amount: data.amount,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      paymentMethod: data.paymentMethod,
      transactionId: data.transactionId,
    },
    include: { policy: { select: { id: true, policyNumber: true } } },
  });
};

const getPaymentsByPolicy = async (policyId, query = {}) => {
  const { skip, take, page, limit } = getPaginationParams(query);

  const policy = await prisma.policy.findFirst({ where: { id: policyId, deletedAt: null } });
  if (!policy) throw ApiError.notFound("Policy");

  const where = {
    policyId,
    ...(query.status && { paymentStatus: query.status }),
  };

  const [payments, total] = await prisma.$transaction([
    prisma.premiumPayment.findMany({ where, skip, take, orderBy: { paymentDate: "desc" } }),
    prisma.premiumPayment.count({ where }),
  ]);

  return { payments, pagination: getPaginationMeta(total, page, limit) };
};

const getOverduePayments = async (query = {}) => {
  const { skip, take, page, limit } = getPaginationParams(query);

  // Mark payments as OVERDUE where dueDate has passed and status is still PENDING
  await prisma.premiumPayment.updateMany({
    where: { paymentStatus: "PENDING", dueDate: { lt: new Date() } },
    data: { paymentStatus: "OVERDUE" },
  });

  const where = { paymentStatus: "OVERDUE" };

  const [payments, total] = await prisma.$transaction([
    prisma.premiumPayment.findMany({
      where, skip, take,
      orderBy: { dueDate: "asc" },
      include: { policy: { select: { id: true, policyNumber: true, customer: { select: { id: true, fullName: true, phone: true } } } } },
    }),
    prisma.premiumPayment.count({ where }),
  ]);

  return { payments, pagination: getPaginationMeta(total, page, limit) };
};

const updatePaymentStatus = async (id, data) => {
  const payment = await prisma.premiumPayment.findUnique({ where: { id } });
  if (!payment) throw ApiError.notFound("Payment");

  return prisma.premiumPayment.update({
    where: { id },
    data: {
      paymentStatus: data.paymentStatus,
      ...(data.transactionId && { transactionId: data.transactionId }),
      ...(data.paymentMethod && { paymentMethod: data.paymentMethod }),
      // Set paymentDate when marking as PAID
      ...(data.paymentStatus === "PAID" && { paymentDate: new Date() }),
    },
  });
};

module.exports = { recordPayment, getPaymentsByPolicy, getOverduePayments, updatePaymentStatus };
