/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { format } from "date-fns";

export function AdminCustomersClient() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [meta, setMeta] = useState({ totalPages: 1, page: 1, limit: 10, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/user/customers?page=${page}&limit=10`, {
          headers: { "Authorization": `Bearer ${token}` }});
        
        if (res.ok) {
          const data = await res.json();
          setCustomers(data.data || data.users || []);
          if (data.meta) setMeta(data.meta);
        }
      } catch (error) {
        console.error("Failed to fetch customers", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCustomers();
  }, [page]);

  return (
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Loading customers...
                </TableCell>
              </TableRow>
            ) : customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
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
                </TableRow>
              ))
            )}
            </TableBody>
          </Table>
        {meta.totalPages > 1 && (
          <div className="mt-4">
            <PaginationControls
              currentPage={page}
              totalPages={meta.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
