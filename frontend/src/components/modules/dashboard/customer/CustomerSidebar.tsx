"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  User, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  CreditCard,
  LogOut,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const customerLinks = [
  { name: "My Profile", href: "/dashboard/customer", icon: User },
  { name: "Orders", href: "/dashboard/customer/orders", icon: ShoppingBag },
  { name: "Wishlist", href: "/dashboard/customer/wishlist", icon: Heart },
  { name: "Addresses", href: "/dashboard/customer/addresses", icon: MapPin },
  { name: "Payment Methods", href: "/dashboard/customer/payment", icon: CreditCard },
];

export function CustomerSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    // trigger auth-change event if needed
    window.dispatchEvent(new Event("auth-change"));
    router.push("/");
  };

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r border-border">
      <div className="flex-1 py-8">
        <div className="px-6 mb-8 text-center">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold mx-auto mb-4">
            JD
          </div>
          <h2 className="font-semibold text-lg">John Doe</h2>
          <p className="text-sm text-muted-foreground">john@example.com</p>
        </div>
        
        <nav className="grid gap-2 px-4">
          {customerLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-border space-y-2">
        <Link
          href="/"
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Home className="h-4 w-4" />
          Go to Storefront
        </Link>
        <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
