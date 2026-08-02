const prisma = require("../lib/prisma");

const getDashboardStats = async () => {
  const [
    totalCustomers,
    activePolicies,
    pendingClaims,
    revenueData,
    expiredPolicies,
    approvedClaims,
  ] = await prisma.$transaction([
    prisma.customer.count({ where: { deletedAt: null } }),
    prisma.policy.count({ where: { status: "ACTIVE", deletedAt: null } }),
    prisma.claim.count({ where: { status: "PENDING" } }),
    prisma.premiumPayment.aggregate({ where: { paymentStatus: "PAID" }, _sum: { amount: true } }),
    prisma.policy.count({ where: { status: "EXPIRED" } }),
    prisma.claim.count({ where: { status: "APPROVED" } }),
  ]);

  return {
    totalCustomers,
    activePolicies,
    pendingClaims,
    totalRevenue: revenueData._sum.amount || 0,
    expiredPolicies,
    approvedClaims,
  };
};

const getRecentActivities = async () => {
  const [recentClaims, recentPolicies, recentPayments] = await prisma.$transaction([
    prisma.claim.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { policy: { select: { policyNumber: true, customer: { select: { fullName: true } } } } },
    }),
    prisma.policy.findMany({
      take: 5,
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      include: { customer: { select: { fullName: true } } },
    }),
    prisma.premiumPayment.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { policy: { select: { policyNumber: true } } },
    }),
  ]);

  return { recentClaims, recentPolicies, recentPayments };
};

const getMonthlyRevenue = async () => {
  const data = await prisma.$queryRaw`
    SELECT DATE_TRUNC('month', "paymentDate") AS month,
           SUM(amount) AS revenue,
           COUNT(*) AS count
    FROM "PremiumPayment"
    WHERE "paymentStatus" = 'PAID'
      AND "paymentDate" >= NOW() - INTERVAL '12 months'
    GROUP BY month
    ORDER BY month ASC
  `;
  return data;
};

module.exports = { getDashboardStats, getRecentActivities, getMonthlyRevenue };
