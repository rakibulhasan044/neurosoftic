import { AdminOrdersClient } from "./AdminOrdersClient";

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Manage and process customer orders.</p>
        </div>
      </div>
      <AdminOrdersClient />
    </div>
  );
}
