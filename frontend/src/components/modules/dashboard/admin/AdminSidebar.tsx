"use client";

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
  BarChart
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
  { name: "Settings", href: "/dashboard/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r border-border">
      <div className="flex h-16 items-center px-6 font-bold text-xl tracking-tight text-primary border-b border-border">
        NeuroAdmin
      </div>
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="grid gap-2 px-4">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
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
      <div className="border-t border-border p-4 text-xs text-center text-muted-foreground">
        Neurosoftic v1.0.0
      </div>
    </div>
  );
}
