import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function LatestCollection() {
  return (
    <section className="py-20 bg-background border-t border-border/40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
              New Arrivals
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">Latest Collection</h2>
            <p className="text-muted-foreground">The newest additions to our premium tech lineup.</p>
          </div>
          <Link href="/products?collection=new" className="hidden sm:flex items-center text-primary hover:text-primary/80 font-medium transition-colors">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="group overflow-hidden border-border/50 bg-card hover:border-primary/50 transition-colors duration-300">
              <div className="aspect-square relative overflow-hidden bg-muted">
                {/* Placeholder for product images */}
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-secondary/20 group-hover:scale-105 transition-transform duration-500">
                  Product Image {i}
                </div>
                <div className="absolute top-2 left-2 px-2 py-1 bg-background/90 backdrop-blur-sm text-xs font-semibold rounded-md shadow-sm">
                  NEW
                </div>
              </div>
              <CardContent className="p-5">
                <h3 className="font-semibold text-lg mb-1 truncate group-hover:text-primary transition-colors">Premium Device {i}</h3>
                <p className="text-sm text-muted-foreground mb-3">High-end electronics</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">${299 + i * 50}.00</span>
                  <Button variant="secondary" size="sm" className="rounded-full">Add to Cart</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-10 flex justify-center sm:hidden">
          <Button variant="outline" className="w-full">View All Products</Button>
        </div>
      </div>
    </section>
  );
}
