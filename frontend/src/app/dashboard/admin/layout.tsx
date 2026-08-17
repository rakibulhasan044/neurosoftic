import { Metadata } from "next";
import { AdminSidebar } from "@/components/modules/dashboard/admin/AdminSidebar";
import { RoleGuard } from "@/components/auth/RoleGuard";

export const metadata: Metadata = {
  title: "Admin Dashboard | Neurosoftic",
  description: "Manage your e-commerce platform.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
      <div className="flex h-screen overflow-hidden bg-muted/20">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </RoleGuard>
  );
}
