const prisma = require("../lib/prisma");
const { buildDateRangeWhere } = require("../utils/queryBuilder");

const getPremiumCollectionReport = async (query = {}) => {
  const dateWhere = buildDateRangeWhere(query.fromDate, query.toDate, "paymentDate");

  const [totalCollected, pendingAmount, overdueAmount, byMonth] = await prisma.$transaction([
    // Total paid amount
    prisma.premiumPayment.aggregate({
      where: { paymentStatus: "PAID", ...dateWhere },
      _sum: { amount: true },
      _count: true,
    }),
    // Total pending
    prisma.premiumPayment.aggregate({
      where: { paymentStatus: "PENDING" },
      _sum: { amount: true },
    }),
    // Total overdue
    prisma.premiumPayment.aggregate({
      where: { paymentStatus: "OVERDUE" },
      _sum: { amount: true },
    }),
    // Group by month (raw query)
    prisma.$queryRaw`
      SELECT DATE_TRUNC('month', "paymentDate") AS month,
             SUM(amount) AS total,
             COUNT(*) AS count
      FROM "PremiumPayment"
      WHERE "paymentStatus" = 'PAID'
      GROUP BY month
      ORDER BY month DESC
      LIMIT 12
    `,
  ]);

  return {
    totalCollected: totalCollected._sum.amount || 0,
    totalCollectedCount: totalCollected._count,
    pendingAmount: pendingAmount._sum.amount || 0,
    overdueAmount: overdueAmount._sum.amount || 0,
    byMonth,
  };
};

const getClaimsReport = async (query = {}) => {
  const dateWhere = buildDateRangeWhere(query.fromDate, query.toDate, "submissionDate");

  const [total, approved, rejected, pending, underReview, totalAmount] = await prisma.$transaction([
    prisma.claim.count({ where: { ...dateWhere } }),
    prisma.claim.count({ where: { status: "APPROVED", ...dateWhere } }),
    prisma.claim.count({ where: { status: "REJECTED", ...dateWhere } }),
    prisma.claim.count({ where: { status: "PENDING", ...dateWhere } }),
    prisma.claim.count({ where: { status: "UNDER_REVIEW", ...dateWhere } }),
    prisma.claim.aggregate({ where: { status: "APPROVED", ...dateWhere }, _sum: { claimAmount: true } }),
  ]);

  return {
    total,
    breakdown: { approved, rejected, pending, underReview },
    approvedTotalAmount: totalAmount._sum.claimAmount || 0,
  };
};

const getCustomerGrowthReport = async () => {
  const byMonth = await prisma.$queryRaw`
    SELECT DATE_TRUNC('month', "createdAt") AS month,
           COUNT(*) AS new_customers
    FROM "Customer"
    WHERE "deletedAt" IS NULL
    GROUP BY month
    ORDER BY month DESC
    LIMIT 12
  `;

  const total = await prisma.customer.count({ where: { deletedAt: null } });

  return { total, byMonth };
};

module.exports = { getPremiumCollectionReport, getClaimsReport, getCustomerGrowthReport };
