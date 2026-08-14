import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, User, MapPin, CreditCard, Package } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import Image from "next/image";
import { OrderStatusUpdate } from "./OrderStatusUpdate";

async function getOrder(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/orders/${id}`, { 
      cache: 'no-store' 
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (error) {
    console.error("Failed to fetch order", error);
  }
  return null;
}

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = await params;
  const order = await getOrder(unwrappedParams.id);

  if (!order) {
    return (
      <div className="container py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Order not found</h2>
        <Link href="/dashboard/admin/orders">
          <Button variant="outline">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  const shippingAddress = order.shippingAddress || {};

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/admin/orders">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            Order #{order.id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-muted-foreground text-sm">
            Placed on {format(new Date(order.createdAt), "PPP 'at' p")}
          </p>
        </div>
        <div className="ml-auto">
          <OrderStatusUpdate orderId={order.id} currentStatus={order.status} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="h-5 w-5" />
                Items ({order.items?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative h-16 w-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                       <div className="w-full h-full flex items-center justify-center bg-secondary/20 text-[10px] text-muted-foreground">Img</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium line-clamp-1">{item.variant?.product?.name || 'Unknown Product'}</h4>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">৳{(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">৳{item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>৳{order.totalAmount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>৳{order.shippingCost?.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-৳{order.discount?.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                  <span>Total</span>
                  <span>৳{order.payableAmount?.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p className="font-medium">{shippingAddress.firstName} {shippingAddress.lastName}</p>
                <p className="text-muted-foreground">{order.customerEmail || order.user?.email}</p>
                <p className="text-muted-foreground">{order.customerPhone || order.user?.phone || shippingAddress.phone}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p className="text-foreground font-medium">{shippingAddress.firstName} {shippingAddress.lastName}</p>
                <p>{shippingAddress.address}</p>
                <p>{shippingAddress.city}{shippingAddress.zipCode ? `, ${shippingAddress.zipCode}` : ''}</p>
                <p>{shippingAddress.country}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="h-5 w-5" />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Method</span>
                  <span className="font-medium">{order.paymentMode?.replace("_", " ")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="outline">{order.payment?.status}</Badge>
                </div>
                {order.paymentMode === 'PARTIAL_PAYMENT' && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Paid Amount</span>
                    <span className="font-medium">৳{order.payment?.amount?.toFixed(2)}</span>
                  </div>
                )}
                
                {/* Due Collection Action (simulated for UI) */}
                {(order.payment?.status === 'PENDING' || order.paymentMode === 'PARTIAL_PAYMENT') && (
                  <Button variant="default" className="w-full mt-4">
                    Record Manual Payment
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
