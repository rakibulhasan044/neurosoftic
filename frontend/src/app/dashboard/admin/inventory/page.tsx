"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Package, Search, Edit2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { PaginationControls } from "@/components/ui/pagination-controls";

export default function AdminInventoryPage() {
  const [variants, setVariants] = useState<any[]>([]);
  const [meta, setMeta] = useState({ totalPages: 1, page: 1, limit: 10, total: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [editingVariant, setEditingVariant] = useState<any>(null);
  const [newStock, setNewStock] = useState("");

  const fetchInventory = async (query = "") => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/inventory?search=${query}&page=${page}&limit=10`, {
        cache: 'no-store',
        headers: { "Authorization": `Bearer ${token}` }});
      if (res.ok) {
        const data = await res.json();
        setVariants(data.data || data.variants || []);
        if (data.meta) setMeta(data.meta);
      } else if (res.status === 401 || res.status === 403) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
      }
    } catch (error) {
      console.error("Failed to fetch inventory", error);
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory(search);
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInventory(search);
  };

  const openEditModal = (variant: any) => {
    setEditingVariant(variant);
    setNewStock(variant.stock.toString());
  };

  const handleAdjustStock = async () => {
    if (!editingVariant) return;
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/inventory/${editingVariant.id}/adjust`, {
        method: 'PATCH',
        headers: { 
        "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json',
          },
        body: JSON.stringify({ stock: parseInt(newStock) })
      });

      if (res.ok) {
        toast.success("Stock updated successfully");
        setEditingVariant(null);
        fetchInventory(search);
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to update stock");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">Manage stock levels across all product variants.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Variant Stock Levels</CardTitle>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input 
                placeholder="Search products..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64"
              />
              <Button type="submit" variant="secondary" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Variant Attributes</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading inventory...</TableCell>
                </TableRow>
              ) : variants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No inventory records found.</TableCell>
                </TableRow>
              ) : (
                variants.map((variant) => (
                  <TableRow key={variant.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 bg-muted rounded overflow-hidden">
                          {variant.product?.media?.[0]?.url ? (
                            <Image src={variant.product.media[0].url} alt="" fill className="object-cover" />
                          ) : (
                            <Package className="h-5 w-5 m-2.5 text-muted-foreground" />
                          )}
                        </div>
                        <span className="font-medium">{variant.product?.name || "Unknown Product"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{variant.sku || "No SKU"}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {variant.size && <Badge variant="secondary" className="text-xs">Size: {variant.size}</Badge>}
                        {variant.color && <Badge variant="secondary" className="text-xs">Color: {variant.color}</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold">{variant.stock}</span>
                    </TableCell>
                    <TableCell>
                      {variant.stock === 0 ? (
                        <Badge variant="destructive">Out of Stock</Badge>
                      ) : variant.stock < 10 ? (
                        <Badge variant="outline" className="border-orange-500 text-orange-500">Low Stock</Badge>
                      ) : (
                        <Badge variant="outline" className="border-green-500 text-green-500">In Stock</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => openEditModal(variant)}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Adjust
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="mt-4">
            <PaginationControls
              currentPage={page}
              totalPages={meta.totalPages}
              onPageChange={setPage}
            />
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!editingVariant} onOpenChange={(open) => !open && setEditingVariant(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Stock</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm font-medium">Product: {editingVariant?.product?.name}</p>
              <p className="text-xs text-muted-foreground">SKU: {editingVariant?.sku}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">New Stock Level</label>
              <Input 
                type="number" 
                min="0"
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingVariant(null)}>Cancel</Button>
            <Button onClick={handleAdjustStock}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
