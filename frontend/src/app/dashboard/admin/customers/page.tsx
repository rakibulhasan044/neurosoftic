import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";

async function getCustomers() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/user/customers`, { 
      cache: 'no-store' 
    });
    if (res.ok) {
      const data = await res.json();
      return data.users || [];
    }
  } catch (error) {
    console.error("Failed to fetch customers", error);
  }
  return [];
}

export default async function AdminCustomersPage() {
  const customers = await getCustomers();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">Manage your customer base and view their activity.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead className="text-right">LTV</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No customers found.
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer: any) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{customer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{customer.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone || customer.profile?.phone || "N/A"}</TableCell>
                    <TableCell>{format(new Date(customer.createdAt), "MMM d, yyyy")}</TableCell>
                    <TableCell>{customer._count?.orders || 0}</TableCell>
                    <TableCell className="text-right font-medium text-primary">
                      {/* LTV calculation not implemented in backend, mocking for now */}
                      ৳{(Math.random() * 10000).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
