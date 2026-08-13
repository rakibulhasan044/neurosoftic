import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Filter } from "lucide-react";

export const metadata: Metadata = {
  title: "All Products | Neurosoftic",
  description: "Browse our collection of premium technology products.",
};

// Define product type matching backend schema
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  categoryId: string;
}

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/products`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch');
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    // Fallback dummy data if backend is not reachable for the demo
    return [
      {
        id: "1",
        name: "Aether Pro Wireless",
        slug: "aether-pro-wireless",
        description: "Next-gen noise cancellation headphones with studio-quality acoustics.",
        price: 349.99,
        stock: 50,
        images: ["/hero-banner.jpg"],
        categoryId: "audio",
      },
      {
        id: "2",
        name: "Nebula Mechanical Keyboard",
        slug: "nebula-mechanical-keyboard",
        description: "Premium tactile feedback with aerospace-grade aluminum body.",
        price: 199.00,
        stock: 30,
        images: [],
        categoryId: "accessories",
      },
      {
        id: "3",
        name: "Quantum Precision Mouse",
        slug: "quantum-precision-mouse",
        description: "Ultra-lightweight wireless mouse with 25k DPI optical sensor.",
        price: 129.50,
        stock: 120,
        images: [],
        categoryId: "accessories",
      },
      {
        id: "4",
        name: "Echo Smart Speaker",
        slug: "echo-smart-speaker",
        description: "Room-filling 360-degree sound with advanced voice control integration.",
        price: 249.00,
        stock: 15,
        images: [],
        categoryId: "audio",
      }
    ];
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => (
          <Link href={`/products/${product.slug}`} key={product.id} className="group">
            <Card className="h-full flex flex-col overflow-hidden border-border/50 bg-card hover:border-primary/50 transition-colors duration-300 shadow-sm">
              <div className="aspect-square relative overflow-hidden bg-muted">
                {product.images && product.images.length > 0 ? (
                  <Image 
                    src={product.images[0]} 
                    alt={product.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-secondary/20 group-hover:scale-105 transition-transform duration-500">
                    Image Not Available
                  </div>
                )}
                {product.stock < 20 && (
                  <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded">
                    Low Stock
                  </div>
                )}
              </div>
              <CardContent className="p-5 flex-1 flex flex-col">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                  {product.description}
                </p>
                <div className="font-bold text-xl">${Number(product.price).toFixed(2)}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
