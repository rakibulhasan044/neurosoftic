import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/modules/products/ProductCard";

export async function BestSellers() {
  let products = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/products`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      products = data.data?.slice(0, 4) || [];
    }
  } catch (error) {}

  if (products.length === 0) {
    return (
      <section className="py-20 bg-muted/20 text-center">
        <h2 className="text-3xl font-bold mb-4">Best Sellers</h2>
        <p className="text-muted-foreground">No products available at the moment.</p>
      </section>
    );
  }

  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">Best Sellers</h2>
          <p className="text-muted-foreground">Our most popular products, loved by thousands of customers worldwide.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((prod: any) => (
            <ProductCard key={prod.id} product={prod} showBadge="BEST" />
          ))}
        </div>
      </div>
    </section>
  );
}
