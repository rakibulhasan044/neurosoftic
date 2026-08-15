import { Metadata } from "next";
import { CustomerSidebar } from "@/components/modules/dashboard/customer/CustomerSidebar";
import { RoleGuard } from "@/components/auth/RoleGuard";

export const metadata: Metadata = {
  title: "My Account | Neurosoftic",
  description: "Manage your account, orders, and preferences.",
};

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8 min-h-[calc(100vh-12rem)]">
          <aside className="w-full md:w-64 flex-shrink-0">
            <CustomerSidebar />
          </aside>
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
