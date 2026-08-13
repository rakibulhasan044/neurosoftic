import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export async function LatestCollection() {
  let products = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/products`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      // sort by newest if we can, else just slice
      products = data.data?.slice(0, 4) || [];
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
          {products.map((prod: any) => {
            const primaryMedia = prod.media?.find((m: any) => m.isPrimary) || prod.media?.[0];
            const price = prod.variants?.[0]?.price || 0;
            return (
            <Card key={prod.id} className="group overflow-hidden border-border/50 bg-card hover:border-primary/50 transition-colors duration-300">
              <div className="aspect-square relative overflow-hidden bg-muted">
                {primaryMedia ? (
                  <img src={primaryMedia.url} alt={prod.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-secondary/20 group-hover:scale-105 transition-transform duration-500">
                    No Image
                  </div>
                )}
                <div className="absolute top-2 left-2 px-2 py-1 bg-background/90 backdrop-blur-sm text-xs font-semibold rounded-md shadow-sm">
                  NEW
                </div>
              </div>
              <CardContent className="p-5">
                <Link href={`/products/${prod.slug}`}>
                  <h3 className="font-semibold text-lg mb-1 truncate group-hover:text-primary transition-colors">{prod.name}</h3>
                </Link>
                <p className="text-sm text-muted-foreground mb-3 truncate">{prod.category?.name || "Premium Product"}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">${price.toFixed(2)}</span>
                  <Link href={`/products/${prod.slug}`}>
                    <Button variant="secondary" size="sm" className="rounded-full">View</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            );
          })}
        </div>
        <div className="mt-10 flex justify-center sm:hidden">
          <Button variant="outline" className="w-full">View All Products</Button>
        </div>
      </div>
    </section>
  );
}
