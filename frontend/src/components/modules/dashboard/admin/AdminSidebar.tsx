"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Home,
  LogOut,
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  Settings,
  Tag,
  MessageSquare,
  BarChart,
  ChevronDown,
  ChevronRight,
  Palette,
  Globe,
  Layout,
  Menu,
  ShieldAlert,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";

const adminLinks = [
  { name: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
  { name: "Inventory", href: "/dashboard/admin/inventory", icon: Package },
  { name: "Orders", href: "/dashboard/admin/orders", icon: ShoppingBag },
  { name: "Customers", href: "/dashboard/admin/customers", icon: Users },
];

const catalogLinks = [
  { name: "Products", href: "/dashboard/admin/catalog/products", icon: Package },
  { name: "Categories", href: "/dashboard/admin/catalog/categories", icon: Tag },
  { name: "Brands", href: "/dashboard/admin/catalog/brands", icon: Layout },
  { name: "Collections", href: "/dashboard/admin/catalog/collections", icon: ShoppingBag },
];

const storeSettingsLinks = [
  { name: "General", href: "/dashboard/admin/store/general", icon: Globe },
  { name: "Branding & Theme", href: "/dashboard/admin/store/branding", icon: Palette },
  { name: "Home Layout", href: "/dashboard/admin/store/home", icon: Layout },
  { name: "Navigation", href: "/dashboard/admin/store/navigation", icon: Menu },
  { name: "FAQ", href: "/dashboard/admin/store/faq", icon: Layout },
  { name: "About Page", href: "/dashboard/admin/store/about", icon: Layout },
  { name: "SEO Settings", href: "/dashboard/admin/store/seo", icon: BarChart },
  { name: "Legal & Policies", href: "/dashboard/admin/store/legal", icon: ShieldAlert },
];

const systemSettingsLinks = [
  { name: "Staff Management", href: "/dashboard/admin/settings/staff", icon: Shield },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const isStoreActive = pathname.startsWith("/dashboard/admin/store");
  const isCatalogActive = pathname.startsWith("/dashboard/admin/catalog");
  const isSystemActive = pathname.startsWith("/dashboard/admin/settings");
  const [storeOpen, setStoreOpen] = useState(isStoreActive);
  const [catalogOpen, setCatalogOpen] = useState(isCatalogActive);
  const [systemOpen, setSystemOpen] = useState(isSystemActive);

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
      <div className="flex h-16 items-center px-6 font-bold text-xl tracking-tight text-primary border-b border-border">
        NeuroAdmin
      </div>
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="grid gap-2 px-4">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (pathname.startsWith(`${link.href}/`) && link.href !== "/dashboard/admin");
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

          {/* Catalog Accordion */}
          <div>
            <button
              onClick={() => setCatalogOpen(!catalogOpen)}
              className={cn(
                "w-full flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isCatalogActive && !catalogOpen 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <Tag className="h-4 w-4" />
                Catalog
              </div>
              {catalogOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            
            {catalogOpen && (
              <div className="mt-1 flex flex-col gap-1 pl-9 pr-2">
                {catalogLinks.map((link) => {
                  const SubIcon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive 
                          ? "bg-primary text-primary-foreground" 
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <SubIcon className="h-3.5 w-3.5" />
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Store Settings Accordion */}
          <div>
            <button
              onClick={() => setStoreOpen(!storeOpen)}
              className={cn(
                "w-full flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isStoreActive && !storeOpen 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4" />
                Store Settings
              </div>
              {storeOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            
            {storeOpen && (
              <div className="mt-1 flex flex-col gap-1 pl-9 pr-2">
                {storeSettingsLinks.map((link) => {
                  const SubIcon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive 
                          ? "bg-primary text-primary-foreground" 
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <SubIcon className="h-3.5 w-3.5" />
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* System Settings Accordion */}
          <div>
            <button
              onClick={() => setSystemOpen(!systemOpen)}
              className={cn(
                "w-full flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isSystemActive && !systemOpen 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4" />
                System Settings
              </div>
              {systemOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            
            {systemOpen && (
              <div className="mt-1 flex flex-col gap-1 pl-9 pr-2">
                {systemSettingsLinks.map((link) => {
                  const SubIcon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive 
                          ? "bg-primary text-primary-foreground" 
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <SubIcon className="h-3.5 w-3.5" />
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>
      </div>
      <div className="border-t border-border p-4 space-y-2">
        <Link
          href="/"
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Home className="h-4 w-4" />
          Go to Storefront
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
