"use client";

import Link from "next/link";
import { Globe, MessageCircle, Share2, Camera } from "lucide-react";
import { usePathname } from "next/navigation";

import { useState, useEffect } from "react";

export function Footer() {
  const pathname = usePathname();
  const [storeName, setStoreName] = useState("NEUROSOFTIC");

  useEffect(() => {
    const fetchStoreSettings = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/store-settings`);
        if (res.ok) {
          const data = await res.json();
          if (data.data?.identity?.companyName) {
            setStoreName(data.data.identity.companyName);
          }
        }
      } catch (err) {
        console.error("Failed to fetch store settings", err);
      }
    };
    fetchStoreSettings();
  }, []);

  if (pathname?.startsWith("/dashboard")) return null;

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold tracking-tight text-primary">{storeName}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premium tech and lifestyle products designed to elevate your everyday experience. 
              Discover the future of personal technology.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Globe className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Camera className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <MessageCircle className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Share2 className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">All Products</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">New Arrivals</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Best Sellers</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Sale</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">FAQ</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Shipping & Returns</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Track Order</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {storeName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
