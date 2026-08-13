"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ShieldCheck, Truck, ArrowLeft, Check } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { toast } from "sonner";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addItem } = useCart();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/products/${slug}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        
        if (json.success && json.data) {
          setProduct(json.data);
          if (json.data.variants && json.data.variants.length > 0) {
            setSelectedVariant(json.data.variants[0]);
          }
          if (json.data.media && json.data.media.length > 0) {
            const primary = json.data.media.find((m: any) => m.isPrimary);
            setActiveImage(primary ? primary.url : json.data.media[0].url);
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
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
        <Link href="/products">
          <Button>Back to Products</Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error("Please select an option first.");
      return;
    }

    if (quantity > selectedVariant.stock) {
      toast.error("Not enough stock available.");
      return;
    }

    addItem({
      id: selectedVariant.id, // Add variant ID to cart
      name: `${product.name} ${selectedVariant.size ? `- ${selectedVariant.size}` : ''} ${selectedVariant.color ? `(${selectedVariant.color})` : ''}`,
      price: selectedVariant.price,
      quantity: quantity,
      image: activeImage || undefined,
    });
    
    toast.success("Added to Cart", {
      description: `${quantity}x ${product.name} has been added to your cart.`,
    });
  };

  const hasVariants = product.variants && product.variants.length > 0;
  const currentPrice = selectedVariant ? selectedVariant.price : 0;
  const currentStock = selectedVariant ? selectedVariant.stock : 0;
  const currentSku = selectedVariant ? selectedVariant.sku : "";

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/products" className="hover:text-primary transition-colors">Catalog</Link>
        <span>/</span>
        {product.category && (
          <>
            <span className="text-foreground">{product.category.name}</span>
            <span>/</span>
          </>
        )}
        <span className="text-primary font-medium truncate">{product.name}</span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square relative rounded-2xl overflow-hidden bg-muted border border-border/50 shadow-sm">
            {activeImage ? (
              <Image 
                src={activeImage} 
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
          
          {/* Thumbnails */}
          {product.media && product.media.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.media.map((img: any) => (
                <button 
                  key={img.id}
                  onClick={() => setActiveImage(img.url)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${activeImage === img.url ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'}`}
                >
                  <Image src={img.url} alt="Thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-2">{product.name}</h1>
          <div className="flex items-center gap-4 mb-6">
            {product.brand && <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{product.brand.name}</span>}
            {currentSku && <span className="text-xs bg-muted px-2 py-1 rounded font-mono text-muted-foreground">SKU: {currentSku}</span>}
          </div>
          
          <div className="text-3xl font-bold text-primary mb-6">${Number(currentPrice).toFixed(2)}</div>
          
          <div className="prose prose-sm dark:prose-invert text-muted-foreground mb-8">
            <p>{product.description || "No description provided."}</p>
          </div>

          <div className="space-y-6 mb-10">
            {/* Variants Selector */}
            {hasVariants && product.variants.length > 1 && (
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold text-sm uppercase tracking-wider">Select Option</h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant: any) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`relative px-4 py-3 rounded-lg border-2 text-left transition-all ${selectedVariant?.id === variant.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 bg-card'}`}
                    >
                      {selectedVariant?.id === variant.id && (
                        <div className="absolute top-2 right-2 text-primary">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                      <div className="font-medium pr-6">{variant.size || variant.color || variant.sku}</div>
                      {variant.color && variant.size && <div className="text-xs text-muted-foreground">{variant.color}</div>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 border-t">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-border rounded-md bg-card">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-none h-14 w-14"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || currentStock === 0}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-none h-14 w-14"
                    onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                    disabled={quantity >= currentStock || currentStock === 0}
                  >
                    +
                  </Button>
                </div>
              </div>

              <Button 
                size="lg" 
                className="flex-1 h-14 text-lg font-semibold rounded-md shadow-lg" 
                onClick={handleAddToCart}
                disabled={currentStock === 0}
              >
                <ShoppingCart className="mr-2 h-5 w-5" /> 
                {currentStock === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
            </div>
            
            {currentStock > 0 && currentStock <= 10 && (
              <p className="text-sm text-orange-500 font-medium">Hurry! Only {currentStock} left in stock.</p>
            )}
            {currentStock === 0 && (
              <p className="text-sm text-destructive font-medium">This item is currently out of stock.</p>
            )}
          </div>

          <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-border/50">
            <div className="flex items-start space-x-3">
              <div className="bg-primary/10 p-2 rounded-full text-primary">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Fast Delivery</h4>
                <p className="text-xs text-muted-foreground">Dispatched within 24 hours</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-primary/10 p-2 rounded-full text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Secure Checkout</h4>
                <p className="text-xs text-muted-foreground">100% protected payments</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
