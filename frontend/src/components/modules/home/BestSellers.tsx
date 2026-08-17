import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/modules/products/ProductCard";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/FadeIn";

export async function BestSellers() {
  let products = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/products`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      // Calculate totalOrders for each product by summing variant orderItems, then sort and take top 8
      const productsWithOrders = (data.data || []).map((p: any) => ({
        ...p,
        computedOrders: p.totalOrders || (p.variants?.reduce((sum: number, v: any) => sum + (v._count?.orderItems || 0), 0)) || 0
      }));
      products = productsWithOrders.sort((a: any, b: any) => b.computedOrders - a.computedOrders).slice(0, 8);
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
        <FadeIn direction="up">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">Best Sellers</h2>
            <p className="text-muted-foreground">Our most popular products, loved by thousands of customers worldwide.</p>
          </div>
        </FadeIn>
        
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} showBadge="BEST" />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
