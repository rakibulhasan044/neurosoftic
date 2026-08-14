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
  },

  getCharts: async (period: string, year: string) => {
    // 1. Category and Brand Sales Aggregation
    const orderItems = await prisma.orderItem.findMany({
      where: {
        order: { status: { notIn: ['CANCELLED', 'DRAFT'] } }
      },
      include: {
        variant: {
          include: {
            product: { select: { category: true, brand: true } }
          }
        }
      }
    });

    const categorySalesMap: Record<string, number> = {};
    const brandSalesMap: Record<string, number> = {};
    const productSalesMap: Record<string, number> = {};

    orderItems.forEach(item => {
      const category = item.variant?.product?.category?.name || 'Uncategorized';
      const brand = item.variant?.product?.brand?.name || 'Unbranded';
      const productName = item.variant?.product?.name || 'Unknown Product';
      const saleValue = item.price * item.quantity;

      categorySalesMap[category] = (categorySalesMap[category] || 0) + saleValue;
      brandSalesMap[brand] = (brandSalesMap[brand] || 0) + saleValue;
      productSalesMap[productName] = (productSalesMap[productName] || 0) + saleValue;
    });

    const categorySales = Object.entries(categorySalesMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5);
    const brandSales = Object.entries(brandSalesMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5);
    const productSales = Object.entries(productSalesMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5);

    // 2. Sales Trend Aggregation
    const currentYear = year ? parseInt(year, 10) : new Date().getFullYear();
    let trendData: any[] = [];
    
    if (period === 'yearly') {
      const orders = await prisma.order.findMany({
        where: { status: { notIn: ['CANCELLED', 'DRAFT'] } },
        select: { createdAt: true, payableAmount: true, totalAmount: true }
      });
      const yearMap: Record<string, number> = {};
      orders.forEach(o => {
        const y = o.createdAt.getFullYear().toString();
        yearMap[y] = (yearMap[y] || 0) + (o.payableAmount || o.totalAmount);
      });
      trendData = Object.entries(yearMap).map(([name, value]) => ({ name, sales: value })).sort((a, b) => a.name.localeCompare(b.name));
    } else if (period === 'weekly') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      sevenDaysAgo.setHours(0,0,0,0);
      const orders = await prisma.order.findMany({
        where: { 
          status: { notIn: ['CANCELLED', 'DRAFT'] },
          createdAt: { gte: sevenDaysAgo }
        },
        select: { createdAt: true, payableAmount: true, totalAmount: true }
      });
      
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayMap: Record<string, number> = {};
      
      // Initialize last 7 days
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dayMap[dayNames[d.getDay()]] = 0;
      }
      
      orders.forEach(o => {
        const dayName = dayNames[o.createdAt.getDay()];
        if (dayMap[dayName] !== undefined) {
          dayMap[dayName] += (o.payableAmount || o.totalAmount);
        }
      });
      
      trendData = Object.keys(dayMap).map(name => ({ name, sales: dayMap[name] }));
    } else { // monthly (default)
      const startOfYear = new Date(currentYear, 0, 1);
      const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);
      const orders = await prisma.order.findMany({
        where: { 
          status: { notIn: ['CANCELLED', 'DRAFT'] },
          createdAt: { gte: startOfYear, lte: endOfYear }
        },
        select: { createdAt: true, payableAmount: true, totalAmount: true }
      });
      
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthMap = monthNames.reduce((acc, m) => { acc[m] = 0; return acc; }, {} as Record<string, number>);
      
      orders.forEach(o => {
        const monthName = monthNames[o.createdAt.getMonth()];
        monthMap[monthName] += (o.payableAmount || o.totalAmount);
      });
      
      trendData = monthNames.map(name => ({ name, sales: monthMap[name] }));
    }

    return {
      trendData,
      categorySales,
      brandSales,
      productSales
    };
  }
};
