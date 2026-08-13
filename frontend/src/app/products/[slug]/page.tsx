"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ShieldCheck, Truck, ArrowLeft } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { toast } from "sonner";
import Link from "next/link";
import { useParams } from "next/navigation";

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

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addItem } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/products`);
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        
        // Find product by slug
        const found = json.data.find((p: Product) => p.slug === slug);
        if (found) {
          setProduct(found);
        } else {
          // Dummy fallback
          setProduct({
            id: "1",
            name: "Aether Pro Wireless",
            slug: "aether-pro-wireless",
            description: "Experience sound in pure fidelity. Next-generation active noise cancellation with studio-quality acoustics. Built with premium aerospace-grade aluminum and memory foam ear cushions for all-day comfort.",
            price: 349.99,
            stock: 50,
            images: ["/hero-banner.jpg"],
            categoryId: "audio",
          });
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        // Fallback for demo
        setProduct({
          id: "1",
          name: "Aether Pro Wireless",
          slug: "aether-pro-wireless",
          description: "Experience sound in pure fidelity. Next-generation active noise cancellation with studio-quality acoustics. Built with premium aerospace-grade aluminum and memory foam ear cushions for all-day comfort.",
          price: 349.99,
          stock: 50,
          images: ["/hero-banner.jpg"],
          categoryId: "audio",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 flex justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Button asChild>
          <Link href="/products">Back to Products</Link>
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images?.[0],
    });
    
    toast("Added to Cart", {
      description: `${quantity}x ${product.name} has been added to your cart.`,
      duration: 3000,
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square relative rounded-2xl overflow-hidden bg-muted border border-border/50 shadow-sm">
            {product.images && product.images.length > 0 ? (
              <Image 
                src={product.images[0]} 
                alt={product.name} 
                fill 
                className="object-cover" 
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-secondary/20">
                No Image Available
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4">{product.name}</h1>
          <div className="text-3xl font-bold text-primary mb-6">${Number(product.price).toFixed(2)}</div>
          
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            {product.description}
          </p>

          <div className="space-y-6 mb-10">
            <div className="flex items-center space-x-4">
              <span className="font-medium">Quantity</span>
              <div className="flex items-center border border-border rounded-md">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-none h-10 w-10"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-none h-10 w-10"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  +
                </Button>
              </div>
              <span className="text-sm text-muted-foreground">{product.stock} available</span>
            </div>

            <Button size="lg" className="w-full h-14 text-lg font-semibold rounded-full" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
          </div>

          <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-border/50">
            <div className="flex items-start space-x-3">
              <div className="bg-primary/10 p-2 rounded-full text-primary">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Free Shipping</h4>
                <p className="text-xs text-muted-foreground">On all orders over $200</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-primary/10 p-2 rounded-full text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">2-Year Warranty</h4>
                <p className="text-xs text-muted-foreground">Full coverage guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
