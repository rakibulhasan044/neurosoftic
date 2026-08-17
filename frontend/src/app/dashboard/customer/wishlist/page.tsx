"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ProductCard } from "@/components/modules/products/ProductCard";

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/wishlist`, {
        headers: { "Authorization": `Bearer ${token}` }});
      const data = await res.json();
      if (res.ok && data.success) {
        setWishlistItems(data.data?.items || []);
      } else if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
      }
    } catch (error) {
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">My Wishlist</h2>
        <p className="text-muted-foreground">Manage your saved products and favorites.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-[400px] bg-muted animate-pulse rounded-xl border border-border/50"></div>
          ))}
        </div>
      ) : wishlistItems.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 border border-dashed rounded-xl">
          <h3 className="text-xl font-semibold mb-2">Your Wishlist is Empty</h3>
          <p className="text-muted-foreground">Save items you love so you can easily find them later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
