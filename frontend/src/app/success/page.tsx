"use client";

import { useEffect } from "react";
import { useCart } from "@/context/cart-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear the cart when landing on the success page
    clearCart();
  }, [clearCart]);

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
            <Link href="/dashboard/customer">
              <Button className="w-full" variant="default">
                View Order Status
              </Button>
            </Link>
            <Link href="/products">
              <Button className="w-full" variant="outline">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
