import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Filter } from "lucide-react";

export const metadata: Metadata = {
  title: "All Products | Neurosoftic",
  description: "Browse our collection of premium products.",
};

async function getProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/products`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch');
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-foreground">All Products</h1>
          <p className="text-muted-foreground">Discover our complete collection of premium devices.</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2 rounded-full">
          <Filter className="h-4 w-4" /> Filter & Sort
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
          <h2 className="text-2xl font-bold mb-2">No Products Found</h2>
          <p className="text-muted-foreground">There are currently no active products in the catalog.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product: any) => {
            // Find base price from variants
            const basePrice = product.variants?.length > 0 ? Math.min(...product.variants.map((v: any) => v.price)) : 0;
            const totalStock = product.variants?.reduce((sum: number, v: any) => sum + v.stock, 0) || 0;
            const primaryImage = product.media?.find((m: any) => m.isPrimary)?.url || product.media?.[0]?.url || null;

            return (
              <Link href={`/products/${product.slug}`} key={product.id} className="group">
                <Card className="h-full flex flex-col overflow-hidden border-border/50 bg-card hover:border-primary/50 transition-colors duration-300 shadow-sm">
                  <div className="aspect-square relative overflow-hidden bg-muted">
                    {primaryImage ? (
                      <Image 
                        src={primaryImage} 
                        alt={product.name} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-secondary/20 group-hover:scale-105 transition-transform duration-500">
                        Image Not Available
                      </div>
                    )}
                    {totalStock < 20 && totalStock > 0 && (
                      <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                        Low Stock
                      </div>
                    )}
                    {totalStock === 0 && (
                      <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded">
                        Out of Stock
                      </div>
                    )}
                  </div>
                  <CardContent className="p-5 flex-1 flex flex-col">
                    <div className="text-xs text-primary font-semibold mb-1 uppercase tracking-wider">{product.category?.name || "Uncategorized"}</div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                      {product.description || "No description available."}
                    </p>
                    <div className="flex items-end justify-between mt-auto">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Starting at</div>
                        <div className="font-bold text-xl">${Number(basePrice).toFixed(2)}</div>
                      </div>
                      <div className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded">
                        {product.variants?.length || 0} Options
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  );
}
