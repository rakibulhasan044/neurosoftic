/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PackageX } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { PaginationControls } from "@/components/ui/pagination-controls";

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [meta, setMeta] = useState({ totalPages: 1, page: 1, limit: 10, total: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/orders/me/orders?page=${page}&limit=10`, {
          headers: { "Authorization": `Bearer ${token}` }});
        if (res.ok) {
          const data = await res.json();
          setOrders(data.data || data.orders || []);
          if (data.meta) setMeta(data.meta);
        } else if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("token");
          window.location.href = "/auth/login";
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [page]);

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
        <p className="text-muted-foreground">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
        <p className="text-muted-foreground mt-2">View and track all your previous purchases.</p>
      </div>

      {orders.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <PackageX className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No orders found</h3>
            <p className="text-muted-foreground mb-6">Looks like you haven&apos;t made any purchases yet.</p>
            <Link href="/products" className={buttonVariants()}>Start Shopping</Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <div className="bg-muted/50 p-4 border-b flex flex-wrap gap-4 items-center justify-between text-sm">
                <div className="flex gap-6">
                  <div>
                    <p className="text-muted-foreground">Order Placed</p>
                    <p className="font-medium">{format(new Date(order.createdAt), "MMM d, yyyy")}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Amount</p>
                    <p className="font-medium">৳{order.payableAmount?.toFixed(2) || order.totalAmount?.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Order Number</p>
                    <p className="font-medium uppercase">#{order.id.slice(0, 8)}</p>
                  </div>
                </div>
                <div>
                  <Link href={`/dashboard/customer/orders/${order.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                    View Details
                  </Link>
                </div>
              </div>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <Badge variant="outline" className="mb-2">
                    {order.status.replace("_", " ")}
                  </Badge>
                  <p className="text-sm font-medium">
                    {order.items?.length || 0} item(s) in this order
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-8">
          <PaginationControls
            currentPage={page}
            totalPages={meta.totalPages}
            onPageChange={setPage}
          />
        </div>
      </>
    )}
    </div>
  );
}
