"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
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
  ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";

const adminLinks = [
  { name: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
  { name: "Catalog", href: "/dashboard/admin/catalog", icon: Tag },
  { name: "Inventory", href: "/dashboard/admin/inventory", icon: Package },
  { name: "Orders", href: "/dashboard/admin/orders", icon: ShoppingBag },
  { name: "Customers", href: "/dashboard/admin/customers", icon: Users },
  { name: "Support", href: "/dashboard/admin/support", icon: MessageSquare },
  { name: "Reports", href: "/dashboard/admin/reports", icon: BarChart },
];

const storeSettingsLinks = [
  { name: "General", href: "/dashboard/admin/store/general", icon: Globe },
  { name: "Branding & Theme", href: "/dashboard/admin/store/branding", icon: Palette },
  { name: "Home Layout", href: "/dashboard/admin/store/home", icon: Layout },
  { name: "Navigation", href: "/dashboard/admin/store/navigation", icon: Menu },
  { name: "SEO Settings", href: "/dashboard/admin/store/seo", icon: BarChart },
  { name: "Legal & Policies", href: "/dashboard/admin/store/legal", icon: ShieldAlert },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const isStoreActive = pathname.startsWith("/dashboard/admin/store");
  const [storeOpen, setStoreOpen] = useState(isStoreActive);

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
        </nav>
      </div>
      <div className="border-t border-border p-4 text-xs text-center text-muted-foreground">
        Neurosoftic v1.0.0
      </div>
    </div>
  );
}
