"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface WishlistContextType {
  wishlistIds: string[];
  addToWishlistContext: (id: string) => void;
  removeFromWishlistContext: (id: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const fetchWishlist = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/wishlist`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok && data.success) {
          const ids = data.data?.items?.map((item: any) => item.id) || [];
          setWishlistIds(ids);
        }
      } catch (err) {
        console.error("Failed to fetch wishlist", err);
      }
    };

    fetchWishlist();
    
    // Also re-fetch when auth changes
    window.addEventListener("auth-change", fetchWishlist);
    return () => {
      window.removeEventListener("auth-change", fetchWishlist);
    };
  }, []);

  const addToWishlistContext = (id: string) => {
    setWishlistIds(prev => {
      if (!prev.includes(id)) return [...prev, id];
      return prev;
    });
  };

  const removeFromWishlistContext = (id: string) => {
    setWishlistIds(prev => prev.filter(itemId => itemId !== id));
  };

  // No need for early return, just wrap children
  return (
    <WishlistContext.Provider value={{ wishlistIds, addToWishlistContext, removeFromWishlistContext }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlistContext() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlistContext must be used within a WishlistProvider");
  }
  return context;
}
