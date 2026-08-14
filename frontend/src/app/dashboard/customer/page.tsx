"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Package, Clock, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function CustomerDashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const [profileRes, ordersRes, wishlistRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/user/profile`, {
            headers: { "Authorization": `Bearer ${token}` }}),
          fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/orders/me/orders?limit=100`, {
            headers: { "Authorization": `Bearer ${token}` }}),
          fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/wishlist`, {
            headers: { "Authorization": `Bearer ${token}` }})
        ]);

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData.data);
        }
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(ordersData.orders || []);
        }
        if (wishlistRes.ok) {
          const wishlistData = await wishlistRes.json();
          setWishlistCount(wishlistData.data?.items?.length || 0);
        }
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const pendingOrders = orders.filter(o => !['DELIVERED', 'CANCELLED', 'RETURNED'].includes(o.status)).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Account</h1>
        <p className="text-muted-foreground mt-2">Welcome back, {profile?.name || (typeof window !== 'undefined' ? localStorage.getItem('userName') : null) || 'Customer'}! Here's an overview of your account.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Deliveries</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Items</CardTitle>
            <Heart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{wishlistCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Your most recent purchases and their status.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground py-4 text-center">Loading orders...</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
              <Link href="/products" className={buttonVariants({ variant: "outline" })}>Start Shopping</Link>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between border rounded-lg p-4 gap-4">
                    <div>
                      <p className="font-semibold text-primary">#{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-sm text-muted-foreground">Placed on {format(new Date(order.createdAt), "MMM d, yyyy")}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold">৳{order.payableAmount?.toFixed(2) || order.totalAmount?.toFixed(2)}</p>
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary/20 text-secondary-foreground">
                          {order.status.replace("_", " ")}
                        </span>
                      </div>
                      <Link href={`/dashboard/customer/orders/${order.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link href="/dashboard/customer/orders" className={buttonVariants({ variant: "link" })}>
                  <span className="flex items-center">
                    View all orders <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
