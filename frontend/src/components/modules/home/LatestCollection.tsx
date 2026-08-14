/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/modules/products/ProductCard";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/FadeIn";

export async function LatestCollection() {
  let products = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/products`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      // sort by newest
      products = (data.data || []).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8);
    }
  } catch (error) {}

  if (products.length === 0) {
    return (
      <section className="py-20 bg-background border-t border-border/40 text-center">
        <h2 className="text-3xl font-bold mb-4">Latest Collection</h2>
        <p className="text-muted-foreground">No products available at the moment.</p>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background border-t border-border/40 ">
      <div className="container mx-auto px-4">
        <FadeIn direction="up">
          <div className="flex justify-between items-end mb-12 ">
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
        </FadeIn>
        
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((prod: any) => (
            <StaggerItem key={prod.id}>
              <ProductCard product={prod} showBadge="NEW" />
            </StaggerItem>
          ))}
        </StaggerContainer>
        <div className="mt-10 flex justify-center sm:hidden">
          <Button variant="outline" className="w-full">View All Products</Button>
        </div>
      </div>
    </section>
  );
}
