import { prisma } from "@/app/lib/prisma";

export const DashboardService = {
  getMetrics: async () => {
    // Basic metrics calculations
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [
      totalOrders,
      todayOrders,
      totalSalesAgg,
      todaySalesAgg,
      statusCountsRaw,
      lowStockProducts
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { createdAt: { gte: today } } }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: { notIn: ['CANCELLED', 'DRAFT'] } }
      }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { 
          createdAt: { gte: today },
          status: { notIn: ['CANCELLED', 'DRAFT'] }
        }
      }),
      prisma.order.groupBy({
        by: ['status'],
        _count: { id: true }
      }),
      prisma.productVariant.count({
        where: { stock: { lt: 10 } } // threshold for low stock
      })
    ]);

    const totalSales = totalSalesAgg._sum.totalAmount || 0;
    const todaySales = todaySalesAgg._sum.totalAmount || 0;
    const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    const statusCounts = statusCountsRaw.reduce((acc, curr) => {
      acc[curr.status] = curr._count.id;
      return acc;
    }, {} as Record<string, number>);

    return {
      overview: {
        totalSales,
        todaySales,
        totalOrders,
        todayOrders,
        avgOrderValue,
        lowStockProducts
      },
      statusCounts
    };
  }
};
