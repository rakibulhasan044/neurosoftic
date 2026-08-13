import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Link from "next/link";

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
          {products.map((prod: any) => {
            const primaryMedia = prod.media?.find((m: any) => m.isPrimary) || prod.media?.[0];
            const price = prod.variants?.[0]?.price || 0;
            return (
            <Card key={prod.id} className="group overflow-hidden border-transparent shadow-sm hover:shadow-md transition-all duration-300">
              <div className="aspect-[4/5] relative overflow-hidden bg-secondary/30">
                {primaryMedia ? (
                  <img src={primaryMedia.url} alt={prod.name} className="object-cover w-full h-full" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    No Image
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center">
                  <Link href={`/products/${prod.slug}`} className="w-full">
                    <Button className="w-full bg-white text-black hover:bg-gray-200">View Product</Button>
                  </Link>
                </div>
              </div>
              <CardContent className="p-5 text-center">
                <div className="flex justify-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <Link href={`/products/${prod.slug}`}>
                  <h3 className="font-medium text-lg mb-1 truncate hover:text-primary">{prod.name}</h3>
                </Link>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-bold text-lg">${price.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
