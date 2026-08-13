import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, ShoppingCart, Activity, PackageOpen, CheckCircle, Clock, XCircle } from "lucide-react";
import { headers } from "next/headers";

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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2 flex justify-center items-center h-[300px] bg-muted/20 border rounded-md m-4">
            <p className="text-muted-foreground">Chart Implementation Placeholder</p>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Order Status Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              
              <div className="flex items-center">
                <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Pending Payment</p>
                </div>
                <div className="ml-auto font-medium text-blue-600">{statusCounts['PENDING_PAYMENT'] || 0}</div>
              </div>

              <div className="flex items-center">
                <div className="h-9 w-9 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <PackageOpen className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Processing & Packed</p>
                </div>
                <div className="ml-auto font-medium text-yellow-600">
                  {(statusCounts['PROCESSING'] || 0) + (statusCounts['PACKED'] || 0)}
                </div>
              </div>

              <div className="flex items-center">
                <div className="h-9 w-9 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Delivered</p>
                </div>
                <div className="ml-auto font-medium text-green-600">{statusCounts['DELIVERED'] || 0}</div>
              </div>

              <div className="flex items-center">
                <div className="h-9 w-9 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Cancelled</p>
                </div>
                <div className="ml-auto font-medium text-red-600">{statusCounts['CANCELLED'] || 0}</div>
              </div>

            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
