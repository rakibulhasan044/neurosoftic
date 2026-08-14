"use client";

import Link from "next/link";
import { Search, User, Menu, LogOut, LayoutDashboard, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CartSheet } from "@/components/cart-sheet";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

export function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [storeName, setStoreName] = useState("NEUROSOFTIC");
  const [storeLogo, setStoreLogo] = useState<string | null>(null);

  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch store settings
    const fetchStoreSettings = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/store-settings`);
        if (res.ok) {
          const data = await res.json();
          if (data.data?.identity?.companyName) {
            setStoreName(data.data.identity.companyName.toUpperCase());
          }
          if (data.data?.theme?.logoUrl) {
            setStoreLogo(data.data.theme.logoUrl);
          }
        }
      } catch (err) {
        console.error("Failed to fetch store settings", err);
      }
    };
    fetchStoreSettings();

    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const name = localStorage.getItem("userName");
      const role = localStorage.getItem("userRole");
      
      if (token) {
        setIsLoggedIn(true);
        if (name) setUserName(name);
        if (role) setUserRole(role);
      } else {
        setIsLoggedIn(false);
        setUserName("");
        setUserRole("");
      }
    };

    // Initial check
    checkAuth();

    // Listen for login/logout events from other components
    window.addEventListener("auth-change", checkAuth);

    // Handle clicking outside of dropdown
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      window.removeEventListener("auth-change", checkAuth);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    setUserName("");
    setUserRole("");
    setDropdownOpen(false);
    router.push("/");
  };

  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  const dashboardLink = userRole === "SUPER_ADMIN" || userRole === "ADMIN" 
    ? "/dashboard/admin" 
    : "/dashboard/customer";

  const pathname = usePathname();
  if (pathname?.startsWith("/dashboard")) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center px-4 mx-auto">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            {storeLogo ? (
               <img src={storeLogo} alt={storeName} className="h-8 w-auto" />
            ) : (
              <span className="hidden font-bold sm:inline-block text-xl tracking-tight text-primary drop-shadow-sm">
                {storeName}
              </span>
            )}
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/products"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Shop
            </Link>
          </nav>
        </div>
        <Sheet>
          <SheetTrigger 
            render={
              <Button
                variant="ghost"
                className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
              />
            }
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0 bg-background">
            <Link
              href="/"
              className="flex items-center"
            >
              <span className="font-bold text-xl tracking-tight text-primary">NEUROSOFTIC</span>
            </Link>
            <div className="flex flex-col space-y-3 mt-6">
              <Link href="/products" className="text-lg">Shop</Link>
            </div>
          </SheetContent>
        </Sheet>
        
        {/* Mobile Logo Centered */}
        <div className="flex flex-1 justify-center md:hidden">
            <Link href="/">
              <span className="font-bold text-lg tracking-tight text-primary">NEUROSOFTIC</span>
            </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="w-full flex-1 md:w-auto md:flex-none hidden lg:block mr-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search products..."
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-9 md:w-[300px]"
              />
            </div>
          </div>
          <nav className="flex items-center space-x-2 relative" ref={dropdownRef}>
            {isLoggedIn ? (
              <div className="relative">
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2 pl-2 pr-3 hidden sm:flex border border-border/50 rounded-full"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                    {getInitials(userName)}
                  </div>
                  <span className="text-sm font-medium max-w-[100px] truncate">
                    {userName || "Account"}
                  </span>
                </Button>
                
                {/* Custom Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md border border-border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-80 slide-in-from-top-2 z-50">
                    <div className="px-2 py-1.5 text-sm font-semibold border-b border-border">
                      {userName || "Account"}
                    </div>
                    <div className="p-1">
                      <Link 
                        href={dashboardLink}
                        onClick={() => setDropdownOpen(false)}
                        className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                      <div className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground text-destructive" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-9 px-0 hover:bg-transparent hidden sm:flex"
                render={<Link href="/auth" />}
              >
                <User className="h-5 w-5 hover:text-primary transition-colors" />
                <span className="sr-only">Account</span>
              </Button>
            )}
            <Link href="/dashboard/customer/wishlist">
              <Button variant="ghost" size="icon" className="w-9 px-0 hover:bg-transparent hidden sm:flex relative">
                <Heart className="h-5 w-5 hover:text-primary transition-colors" />
                <span className="sr-only">Wishlist</span>
              </Button>
            </Link>
            <CartSheet />
          </nav>
        </div>
      </div>
    </header>
  );
}
