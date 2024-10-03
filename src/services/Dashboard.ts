import prisma from "../utils/db";

export async function getDashboardData() {
  const totalUsers = await prisma.user.count();
  const totalProducts = await prisma.product.count();
  const totalOrders = await prisma.order.count();
  const usersByMonth = await prisma.user.groupBy({
    by: ["createdAt"],
    _count: {
      id: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  const ordersByMonth = await prisma.order.groupBy({
    by: ["createdAt"],
    _count: {
      id: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  const pendingOrders = await prisma.order.count({
    where: {
      orderStatus: "PENDING",
    },
  });
  const completedOrders = await prisma.order.count({
    where: {
      orderStatus: "COMPLETED",
    },
  });
  const cancelledOrders = await prisma.order.count({
    where: {
      orderStatus: "CANCELLED",
    },
  });

  const totalReviews = await prisma.review.count();
  const totalSales = await prisma.order.aggregate({ _sum: { amount: true } });
  const salesByMonth = await prisma.order.groupBy({
    by: ["createdAt"],
    _sum: {
      amount: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return {
    totalUsers: {
      all: totalUsers,
      monthly: usersByMonth,
    },
    totalProducts,
    totalOrders: {
      all: totalOrders,
      monthly: ordersByMonth,
    },
    totalReviews,
    pendingOrders,
    completedOrders,
    cancelledOrders,
    totalSales: totalSales._sum.amount || 0,
    salesByMonth,
  };
}
