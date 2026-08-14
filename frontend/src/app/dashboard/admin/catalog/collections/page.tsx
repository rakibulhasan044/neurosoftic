"use client";

import { useState, useRef } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export default function CollectionsPage() {
  const { data: collections = [], isLoading, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/collections`,
    fetcher
  );
  
  const { data: products = [] } = useSWR(
    `${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/products`,
    fetcher
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{name: string, description: string, banner: string, productIds: string[]}>({ name: "", description: "", banner: "", productIds: [] });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openCreateDialog = () => {
    setEditingId(null);
    setFormData({ name: "", description: "", banner: "", productIds: [] });
    setIsDialogOpen(true);
  };

  const openEditDialog = (col: any) => {
    setEditingId(col.id);
    setFormData({ 
      name: col.name || "", 
      description: col.description || "", 
      banner: col.banner || "",
      productIds: col.products?.map((p: any) => p.id) || []
    });
    setIsDialogOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const token = localStorage.getItem("token");
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/upload`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
        body: fd
      });
      
      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, banner: data.data.url }));
        toast.success("Banner uploaded successfully");
      } else {
        toast.error(data.message || "Failed to upload banner");
      }
    } catch (err) {
      toast.error("An error occurred during upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const method = editingId ? "PATCH" : "POST";
    const url = editingId 
      ? `${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/collections/${editingId}`
      : `${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/collections`;

    // Optimistic Update
    const optimisticData = editingId 
      ? collections.map((c: any) => c.id === editingId ? { ...c, ...formData } : c)
      : [...collections, { id: `temp-${Date.now()}`, ...formData }];
      
    mutate(optimisticData, false);
    setIsDialogOpen(false);

    try {
      const res = await fetch(url, {
        method,
        headers: { 
        "Authorization": `Bearer ${token}`, 
          "Content-Type": "application/json",
          },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success(`Collection ${editingId ? 'updated' : 'created'} successfully`);
        mutate();
      } else {
        toast.error(data.message || `Failed to ${editingId ? 'update' : 'create'} collection`);
        mutate();
      }
    } catch (err) {
      toast.error("An error occurred");
      mutate();
    }
  };

  const deleteCollection = async () => {
    if (!deleteId) return;
    const currentDeleteId = deleteId;
    setDeleteId(null);
    
    mutate(collections.filter((c: any) => c.id !== currentDeleteId), false);
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/collections/${currentDeleteId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }});
      if (res.ok) {
        toast.success("Collection deleted securely");
        mutate();
      } else {
        toast.error("Failed to delete collection");
        mutate();
      }
    } catch (err) {
      toast.error("An error occurred");
      mutate();
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
          <p className="text-muted-foreground">Manage dynamic product collections and campaigns.</p>
        </div>
        
        <div>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" /> Add Collection
          </Button>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Collection" : "Create Collection"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              
              {/* Banner Upload Area */}
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg bg-muted/30 relative">
                {formData.banner ? (
                  <div className="relative w-full h-32 rounded-md overflow-hidden mb-4">
                    <Image src={formData.banner} alt="Collection Banner" fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4 text-muted-foreground">
                    <ImageIcon className="h-8 w-8" />
                  </div>
                )}
                
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                />
                <Button 
                  type="button" 
                  variant="secondary" 
                  size="sm" 
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isUploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</> : "Upload Collection Banner"}
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Collection Name</Label>
                <Input 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Summer Sale 2026" 
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Collection description" 
                />
              </div>

              <div className="space-y-2">
                <Label>Products in Collection</Label>
                <div className="border rounded-md p-4 max-h-48 overflow-y-auto space-y-2 bg-muted/20">
                  {products.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No products available.</p>
                  ) : (
                    products.map(product => (
                      <div key={product.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`product-${product.id}`}
                          checked={formData.productIds.includes(product.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, productIds: [...formData.productIds, product.id] });
                            } else {
                              setFormData({ ...formData, productIds: formData.productIds.filter(id => id !== product.id) });
                            }
                          }}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor={`product-${product.id}`} className="text-sm cursor-pointer">
                          {product.name}
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isUploading}>
                {editingId ? "Update Collection" : "Create Collection"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Banner</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">Loading...</TableCell>
              </TableRow>
            ) : collections.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No collections found.</TableCell>
              </TableRow>
            ) : (
              collections.map((col) => (
                <TableRow key={col.id}>
                  <TableCell>
                    {col.banner ? (
                      <div className="w-16 h-10 rounded-md overflow-hidden relative border">
                        <Image src={col.banner} alt={col.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-16 h-10 rounded-md bg-secondary flex items-center justify-center text-xs text-muted-foreground border">
                        <ImageIcon className="h-4 w-4" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{col.name}</TableCell>
                  <TableCell className="text-muted-foreground">{col.slug}</TableCell>
                  <TableCell>{col._count?.products || 0}</TableCell>
                  <TableCell>
                    {col.startDate ? new Date(col.startDate).toLocaleDateString() : 'Always'}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${col.isActive ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'}`}>
                      {col.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(col)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(col.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the collection
              and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteCollection} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
