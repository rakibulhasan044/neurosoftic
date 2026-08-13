"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="bg-primary text-primary-foreground px-4 py-2 text-center text-xs sm:text-sm font-medium flex items-center justify-center gap-2">
      <span className="hidden sm:inline-block">Special Offer:</span>
      <span>Get 20% off on your first order. Use code <strong>WELCOME20</strong></span>
      <Link href="/products" className="inline-flex items-center hover:underline font-semibold ml-2">
        Shop Now <ArrowRight className="ml-1 h-3 w-3" />
      </Link>
    </div>
  );
}
