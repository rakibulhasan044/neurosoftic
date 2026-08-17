/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Heart } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useWishlistContext } from "@/context/wishlist-context";

interface ProductCardProps {
  product: any;
  showBadge?: string;
}

export function ProductCard({ product, showBadge }: ProductCardProps) {
  const [isWishlisting, setIsWishlisting] = useState(false);
  const { wishlistIds, addToWishlistContext, removeFromWishlistContext } = useWishlistContext();
  const inWishlist = wishlistIds.includes(product.id);

  const primaryImage = product.media?.find((m: any) => m.isPrimary)?.url || product.media?.[0]?.url || null;
  const basePrice = product.variants?.length > 0 ? Math.min(...product.variants.map((v: any) => v.price)) : 0;
  const totalStock = product.variants?.reduce((sum: number, v: any) => sum + v.stock, 0) || 0;
  
  const avgRating = product.avgRating || "0.0";
  const totalOrders = product.totalOrders || (product.variants?.reduce((sum: number, v: any) => sum + (v._count?.orderItems || 0), 0)) || 0;
  
  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to product link
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to add to wishlist");
      return;
    }

    setIsWishlisting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/wishlist/toggle`, {
        method: "POST",
        headers: { 
        "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          },
        body: JSON.stringify({ productId: product.id })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.added) {
          addToWishlistContext(product.id);
        } else {
          removeFromWishlistContext(product.id);
        }
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to update wishlist");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsWishlisting(false);
    }
  };

  return (
    <Link href={`/products/${product.slug}`} className="group h-full flex">
      <motion.div 
        whileHover={{ y: -5, transition: { duration: 0.2, ease: "easeOut" } }}
        className="w-full flex"
      >
        <Card className="w-full flex flex-col overflow-hidden border-border/50 bg-card group-hover:border-primary/50 group-hover:shadow-md transition-colors duration-300 shadow-sm relative">
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
          
          {/* Wishlist Button */}
          <button 
            onClick={handleWishlistToggle}
            disabled={isWishlisting}
            className="absolute top-3 right-3 p-2 bg-background/80 hover:bg-background rounded-full shadow-sm backdrop-blur-sm transition-all z-10"
          >
            <Heart className={`h-4 w-4 ${inWishlist ? "fill-red-500 text-red-500" : "text-foreground"}`} />
          </button>

          {showBadge && (
            <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded shadow-sm">
              {showBadge}
            </div>
          )}
          {!showBadge && totalStock < 20 && totalStock > 0 && (
            <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
              Low Stock
            </div>
          )}
          {!showBadge && totalStock === 0 && (
            <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded shadow-sm">
              Out of Stock
            </div>
          )}
        </div>
        
        <CardContent className="p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-1">
            <div className="text-xs text-primary font-semibold uppercase tracking-wider">{product.category?.name || "Premium Product"}</div>
            <div className="flex items-center text-xs font-medium bg-secondary/50 px-1.5 py-0.5 rounded text-muted-foreground">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
              {avgRating}
            </div>
          </div>
          
          <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
          
          <div className="text-xs text-muted-foreground mb-4 flex items-center">
            <span className="mr-2">{totalOrders} Orders</span>
            • 
            <span className="ml-2">{product._count?.reviews || 0} Reviews</span>
          </div>

          <div className="flex items-end justify-between mt-auto">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Starting at</div>
              <div className="font-bold text-xl">৳{Number(basePrice).toFixed(2)}</div>
            </div>
            <div className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded">
              {product.variants?.length || 0} Options
            </div>
          </div>
        </CardContent>
      </Card>
      </motion.div>
    </Link>
  );
}
