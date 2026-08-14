"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

interface CancelOrderDialogProps {
  orderId: string;
  status: string;
  shippingCost: number;
}

export function CancelOrderDialog({ orderId, status, shippingCost }: CancelOrderDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // If order is delivered or already cancelled, they cannot cancel it.
  if (status === "DELIVERED" || status === "CANCELLED") {
    return null;
  }

  const handleCancelOrder = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/orders/${orderId}/cancel`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }});

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Order cancelled successfully");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(data.message || "Failed to cancel order");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const isShipped = status === "SHIPPED";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="destructive" size="sm" />}>
        <XCircle className="h-4 w-4 mr-2" />
        Cancel Order
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Order</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel this order? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isShipped ? (
            <p className="text-sm text-destructive font-medium bg-destructive/10 p-3 rounded-md">
              Warning: Since your order has already been shipped, the delivery fee of ৳{shippingCost.toFixed(2)} will be deducted from your total refund.
            </p>
          ) : (
            <p className="text-sm text-green-600 font-medium bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
              Your order has not shipped yet. You will receive a full refund.
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Keep Order
          </Button>
          <Button variant="destructive" onClick={handleCancelOrder} disabled={loading}>
            {loading ? "Cancelling..." : "Confirm Cancellation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
