import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { ProductCard } from "@/components/modules/products/ProductCard";

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
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
