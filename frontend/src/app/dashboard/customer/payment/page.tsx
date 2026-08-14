"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, AlertCircle } from "lucide-react";
import { format } from "date-fns";

export default function CustomerPaymentPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        // Fetch orders to extract payments (since a dedicated payments endpoint might not exist)
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/orders/me/orders`, {
          headers: { "Authorization": `Bearer ${token}` }});
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const pendingPayments = orders.filter(o => o.status === "PENDING_PAYMENT" && o.payment?.status !== "PAID");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payments & Due Balances</h1>
        <p className="text-muted-foreground mt-2">Manage your payment history and outstanding balances.</p>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading payments...</p>
      ) : (
        <div className="space-y-6">
          {pendingPayments.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                Action Required
              </h3>
              {pendingPayments.map(order => (
                <Card key={order.id} className="border-destructive/50 shadow-sm">
                  <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold">Order #{order.id.slice(0,8).toUpperCase()}</p>
                      <p className="text-sm text-muted-foreground">Due Date: {format(new Date(order.createdAt), "MMM d, yyyy")}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-bold text-lg">৳{order.payableAmount?.toFixed(2)}</p>
                      <Button>Pay Now</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>A list of your previous transactions.</CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <CreditCard className="h-8 w-8 mx-auto mb-2 opacity-20" />
                  No payment history found.
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium text-sm">Payment for Order #{order.id.slice(0,8).toUpperCase()}</p>
                        <p className="text-xs text-muted-foreground">{format(new Date(order.createdAt), "MMM d, yyyy")}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">৳{order.payableAmount?.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">{order.payment?.status || 'PENDING'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
