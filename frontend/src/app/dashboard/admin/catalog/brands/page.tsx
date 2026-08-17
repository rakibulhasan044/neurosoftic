/* eslint-disable @typescript-eslint/no-explicit-any */
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

export default function BrandsPage() {
  const { data: brands = [], isLoading, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/brands`,
    fetcher
  );
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "", logo: "" });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openCreateDialog = () => {
    setEditingId(null);
    setFormData({ name: "", description: "", logo: "" });
    setIsDialogOpen(true);
  };

  const openEditDialog = (brand: any) => {
    setEditingId(brand.id);
    setFormData({ 
      name: brand.name || "", 
      description: brand.description || "", 
      logo: brand.logo || "" 
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
        setFormData(prev => ({ ...prev, logo: data.data.url }));
        toast.success("Logo uploaded successfully");
      } else {
        toast.error(data.message || "Failed to upload logo");
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
      ? `${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/brands/${editingId}`
      : `${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/brands`;

    // Optimistic Update
    const optimisticData = editingId 
      ? brands.map((b: any) => b.id === editingId ? { ...b, ...formData } : b)
      : [...brands, { id: `temp-${Date.now()}`, ...formData }];
      
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
        toast.success(`Brand ${editingId ? 'updated' : 'created'} successfully`);
        mutate();
      } else {
        toast.error(data.message || `Failed to ${editingId ? 'update' : 'create'} brand`);
        mutate();
      }
    } catch (err) {
      toast.error("An error occurred");
      mutate();
    }
  };

  const deleteBrand = async () => {
    if (!deleteId) return;
    const currentDeleteId = deleteId;
    setDeleteId(null);
    
    mutate(brands.filter((b: any) => b.id !== currentDeleteId), false);
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/brands/${currentDeleteId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }});
      if (res.ok) {
        toast.success("Brand deleted securely");
        mutate();
      } else {
        toast.error("Failed to delete brand");
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
          <h1 className="text-3xl font-bold tracking-tight">Brands</h1>
          <p className="text-muted-foreground">Manage the brands available in your catalog.</p>
        </div>
        
        <div>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" /> Add Brand
          </Button>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Brand" : "Create Brand"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              
              {/* Logo Upload Area */}
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg bg-muted/30 relative">
                {formData.logo ? (
                  <div className="relative w-24 h-24 rounded-md overflow-hidden mb-4 bg-white p-2">
                    <Image src={formData.logo} alt="Brand" fill className="object-contain p-2" />
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
                  {isUploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</> : "Upload Brand Logo"}
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Brand Name</Label>
                <Input 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Sony" 
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Brand description" 
                />
              </div>
              <Button type="submit" className="w-full" disabled={isUploading}>
                {editingId ? "Update Brand" : "Create Brand"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">Loading...</TableCell>
              </TableRow>
            ) : brands.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No brands found.</TableCell>
              </TableRow>
            ) : (
              brands.map((brand: any) => (
                <TableRow key={brand.id}>
                  <TableCell>
                    {brand.logo ? (
                      <div className="w-10 h-10 rounded-md overflow-hidden relative border bg-white">
                        <Image src={brand.logo} alt={brand.name} fill className="object-contain p-1" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center text-xs text-muted-foreground border">
                        <ImageIcon className="h-4 w-4" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{brand.name}</TableCell>
                  <TableCell className="text-muted-foreground">{brand.slug}</TableCell>
                  <TableCell>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${brand.isActive ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'}`}>
                      {brand.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(brand)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(brand.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
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
              This action cannot be undone. This will permanently delete the brand
              and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteBrand} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
