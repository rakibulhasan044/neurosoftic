import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, ShoppingCart, Activity, PackageOpen, CheckCircle, Clock, XCircle } from "lucide-react";
import { headers } from "next/headers";
import { DashboardCharts } from "./DashboardCharts";

async function getDashboardMetrics() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/dashboard/metrics`, { 
      cache: 'no-store' 
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (error) {
    console.error("Failed to fetch dashboard metrics", error);
  }
  return null;
}

export default async function AdminDashboardPage() {
  const metrics = await getDashboardMetrics();

  const overview = metrics?.overview || {
    totalSales: 0,
    todaySales: 0,
    totalOrders: 0,
    todayOrders: 0,
    avgOrderValue: 0,
    lowStockProducts: 0
  };

  const statusCounts = metrics?.statusCounts || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">Here's what's happening with your store today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{overview.totalSales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Lifetime revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Total orders placed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders Today</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{overview.todaySales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From {overview.todayOrders} orders today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <PackageOpen className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{overview.lowStockProducts}</div>
            <p className="text-xs text-muted-foreground">Products below threshold</p>
          </CardContent>
        </Card>
      </div>
      <DashboardCharts statusCounts={statusCounts} />
    </div>
  );
}
