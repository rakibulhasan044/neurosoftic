import { Truck, Shield, Zap } from "lucide-react";

export function TrustUSP() {
  return (
    <section className="border-y border-border/50 bg-background/50 backdrop-blur-sm py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="p-4 rounded-full bg-primary/10 text-primary mb-2 transition-transform hover:scale-110">
              <Truck className="h-8 w-8" />
            </div>
            <h3 className="font-semibold text-lg text-foreground">Free Express Delivery</h3>
            <p className="text-sm text-muted-foreground">On all orders over $200. Tracked and insured.</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="p-4 rounded-full bg-primary/10 text-primary mb-2 transition-transform hover:scale-110">
              <Shield className="h-8 w-8" />
            </div>
            <h3 className="font-semibold text-lg text-foreground">2-Year Warranty</h3>
            <p className="text-sm text-muted-foreground">Premium protection included on all electronics.</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="p-4 rounded-full bg-primary/10 text-primary mb-2 transition-transform hover:scale-110">
              <Zap className="h-8 w-8" />
            </div>
            <h3 className="font-semibold text-lg text-foreground">Secure Checkout</h3>
            <p className="text-sm text-muted-foreground">Encrypted payment processing for your safety.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
