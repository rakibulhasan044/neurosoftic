import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { ProductCard } from "@/components/modules/products/ProductCard";
import { ProductsFilterClient } from "./ProductsFilterClient";

export const metadata: Metadata = {
  title: "All Products | Neurosoftic",
  description: "Browse our collection of premium products.",
};

async function getProducts(searchParams?: any) {
  try {
    let url = `${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/products`;
    const query = new URLSearchParams();
    if (searchParams?.category) query.append("category", searchParams.category);
    if (searchParams?.brand) query.append("brand", searchParams.brand);
    if (searchParams?.sort) query.append("sort", searchParams.sort);
    if (searchParams?.search) query.append("search", searchParams.search);
    
    if (query.toString()) {
      url += `?${query.toString()}`;
    }
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch');
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/categories`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    return [];
  }
}

async function getBrands() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/brands`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    return [];
  }
}

export default async function ProductsPage({ searchParams }: any) {
  // Await searchParams in Next.js 15
  const params = await searchParams;
  const [products, categories, brands] = await Promise.all([
    getProducts(params),
    getCategories(),
    getBrands()
  ]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-foreground">All Products</h1>
          <p className="text-muted-foreground">Discover our complete collection of premium devices.</p>
        </div>
        <ProductsFilterClient categories={categories} brands={brands} currentParams={params} />
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
