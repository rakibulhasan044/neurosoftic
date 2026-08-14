"use client";

import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, CreditCard, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function CheckoutPageContent() {
  const { items, cartTotal, clearCart } = useCart();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [shippingMethod, setShippingMethod] = useState("inside_dhaka");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    zipCode: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast("Cart is empty", {
        description: "Please add items to your cart before checking out.",
      });
      return;
    }

    setLoading(true);
    try {
      // Create payload matching backend expectations
      // We will map cart item IDs to productVariantId for the backend
      const payload = {
        items: items.map(item => ({
          productVariantId: item.id, // using product id as variant id for this implementation
          quantity: item.quantity,
          price: item.price
        })),
        shippingMethod,
        paymentMethod,
        customerInfo: formData,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/checkout`
      };

      // Try to create order with the backend
      const token = localStorage.getItem('token');
      const headers: any = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      
      if (res.ok && json.data) {
        if (json.data.url) {
          // Redirect to Stripe Checkout Session
          window.location.href = json.data.url;
        } else {
          // COD or Manual payment successful immediately
          clearCart();
          router.push("/success");
        }
      } else {
        toast.error("Checkout Failed", {
          description: json.message || "Something went wrong during checkout.",
        });
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error("Error", {
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-lg">
        <ShoppingCartIcon className="h-20 w-20 mx-auto text-muted mb-6" />
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link href="/products">
          <Button size="lg" className="w-full h-14">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 min-h-[calc(100vh-4rem)] py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-extrabold tracking-tight mb-8">Secure Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>We'll use this email to send you order updates.</CardDescription>
              </CardHeader>
              <CardContent>
                <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email address</label>
                    <Input id="email" name="email" type="email" placeholder="you@example.com" required onChange={handleInputChange} />
                  </div>
                  
                  <div className="pt-6">
                    <h3 className="font-semibold text-lg mb-4">Shipping Address</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="firstName" className="text-sm font-medium">First name</label>
                        <Input id="firstName" name="firstName" required onChange={handleInputChange} />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="lastName" className="text-sm font-medium">Last name</label>
                        <Input id="lastName" name="lastName" required onChange={handleInputChange} />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                        <Input id="phone" name="phone" required onChange={handleInputChange} />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <label htmlFor="address" className="text-sm font-medium">Address</label>
                        <Input id="address" name="address" required onChange={handleInputChange} />
                      </div>
                      <div className="col-span-2 sm:col-span-1 space-y-2">
                        <label htmlFor="city" className="text-sm font-medium">City</label>
                        <Input id="city" name="city" required onChange={handleInputChange} />
                      </div>
                      <div className="col-span-2 sm:col-span-1 space-y-2">
                        <label htmlFor="zipCode" className="text-sm font-medium">Postal Code</label>
                        <Input id="zipCode" name="zipCode" required onChange={handleInputChange} />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <h3 className="font-semibold text-lg mb-4">Shipping Method</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors">
                        <input type="radio" name="shipping" value="inside_dhaka" checked={shippingMethod === "inside_dhaka"} onChange={(e) => setShippingMethod(e.target.value)} className="h-4 w-4" />
                        <div className="flex-1">
                          <p className="font-medium">Inside Dhaka</p>
                          <p className="text-xs text-muted-foreground">Delivery in 1-2 days</p>
                        </div>
                        <span className="font-medium">৳60</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors">
                        <input type="radio" name="shipping" value="outside_dhaka" checked={shippingMethod === "outside_dhaka"} onChange={(e) => setShippingMethod(e.target.value)} className="h-4 w-4" />
                        <div className="flex-1">
                          <p className="font-medium">Outside Dhaka</p>
                          <p className="text-xs text-muted-foreground">Delivery in 3-5 days</p>
                        </div>
                        <span className="font-medium">৳120</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-6">
                    <h3 className="font-semibold text-lg mb-4">Payment Method</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors">
                        <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={(e) => setPaymentMethod(e.target.value)} className="h-4 w-4" />
                        <div className="flex-1">
                          <p className="font-medium">Cash on Delivery</p>
                          <p className="text-xs text-muted-foreground">Pay when you receive the package</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors">
                        <input type="radio" name="payment" value="partial" checked={paymentMethod === "partial"} onChange={(e) => setPaymentMethod(e.target.value)} className="h-4 w-4" />
                        <div className="flex-1">
                          <p className="font-medium">Pay Advance (৳200)</p>
                          <p className="text-xs text-muted-foreground">Pay ৳200 now, rest on delivery (Credit/Debit/bKash)</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors">
                        <input type="radio" name="payment" value="stripe" checked={paymentMethod === "stripe"} onChange={(e) => setPaymentMethod(e.target.value)} className="h-4 w-4" />
                        <div className="flex-1">
                          <p className="font-medium">Pay Full Online</p>
                          <p className="text-xs text-muted-foreground">Pay securely via Credit/Debit Cards</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="border-border/50 shadow-sm sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-secondary/20 text-[10px] text-muted-foreground">Img</div>
                        )}
                        <span className="absolute top-0 right-0 bg-primary/90 text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-bl-md">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium line-clamp-2">{item.name}</h4>
                        <p className="text-sm font-semibold text-muted-foreground mt-1">৳{item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {(() => {
                  const shippingCost = shippingMethod === "inside_dhaka" ? 60 : shippingMethod === "outside_dhaka" ? 120 : 0;
                  const finalTotal = cartTotal + shippingCost;
                  const advanceAmount = paymentMethod === "partial" ? 200 : finalTotal;
                  return (
                    <div className="mt-6 pt-6 border-t border-border/50 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">৳{cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="font-medium">৳{shippingCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold pt-3 border-t border-border/50">
                        <span>Total</span>
                        <span>৳{finalTotal.toFixed(2)}</span>
                      </div>
                      {paymentMethod === "partial" && (
                        <div className="flex justify-between text-sm font-bold text-primary pt-1">
                          <span>Pay Now (Advance)</span>
                          <span>৳{advanceAmount.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  );
                })()}

                <div className="mt-8 space-y-4">
                  <Button 
                    type="submit" 
                    form="checkout-form"
                    className="w-full h-14 text-lg font-semibold"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        {paymentMethod === 'cod' ? (
                          <>Confirm Order</>
                        ) : (
                          <><CreditCard className="h-5 w-5" /> Pay Now</>
                        )}
                      </span>
                    )}
                  </Button>
                  
                  <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3" />
                    <span>Payments are secure and encrypted.</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-primary" />
              <span>Neurosoftic Buyer Protection</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Icon for empty cart
function ShoppingCartIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  )
}
