import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Clock, CheckCircle, PackageOpen, XCircle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

async function getOrders() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/orders`, { 
      cache: 'no-store' 
    });
    if (res.ok) {
      const data = await res.json();
      return data.orders || [];
    }
  } catch (error) {
    console.error("Failed to fetch orders", error);
  }
  return [];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING_PAYMENT': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'CONFIRMED': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
    case 'PROCESSING': 
    case 'PACKED': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'SHIPPED': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
    case 'DELIVERED': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'CANCELLED': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
  }
};

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Manage and process customer orders.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order: any) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">{order.id.slice(0, 8).toUpperCase()}</TableCell>
                    <TableCell>{format(new Date(order.createdAt), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      {order.user?.name || "Guest"}
                      <div className="text-xs text-muted-foreground">{order.customerEmail || order.user?.email || "No email"}</div>
                    </TableCell>
                    <TableCell className="font-medium">৳{order.payableAmount?.toFixed(2) || order.totalAmount?.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)} variant="outline">
                        {order.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {order.paymentMode?.replace("_", " ") || "COD"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {order.payment?.status || "PENDING"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/dashboard/admin/orders/${order.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
