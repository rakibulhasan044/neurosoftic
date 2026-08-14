"use client";

import { useEffect, Suspense } from "react";
import { useCart } from "@/context/cart-context";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

function SuccessContent() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Clear the cart when landing on the success page
    clearCart();

    const orderId = searchParams.get("order_id");
    if (orderId) {
      // Simulate webhook confirmation for local testing
      fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/orders/confirm-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId })
      }).catch(console.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-muted/20 p-4">
      <Card className="max-w-md w-full text-center border-border/50 shadow-sm">
        <CardContent className="pt-10 pb-8 px-6">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-8">
            Thank you for your purchase. We have received your order and will start processing it right away.
          </p>
          <div className="space-y-3">
            <Link href="/dashboard/customer" className={buttonVariants({ variant: "default", className: "w-full" })}>
              View Order Status
            </Link>
            <Link href="/products" className={buttonVariants({ variant: "outline", className: "w-full" })}>
              Continue Shopping
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
