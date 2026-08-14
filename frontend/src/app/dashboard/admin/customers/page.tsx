import { AdminCustomersClient } from "./AdminCustomersClient";

export default function AdminCustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">Manage your customer base and view their activity.</p>
        </div>
      </div>
      <AdminCustomersClient />
    </div>
  );
}
