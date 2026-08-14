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
  DialogTrigger,
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

export default function CategoriesPage() {
  const { data: categories = [], isLoading, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/categories`,
    fetcher
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", prefix: "", description: "", image: "" });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openCreateDialog = () => {
    setEditingId(null);
    setFormData({ name: "", prefix: "", description: "", image: "" });
    setIsDialogOpen(true);
  };

  const openEditDialog = (cat: any) => {
    setEditingId(cat.id);
    setFormData({ 
      name: cat.name || "", 
      prefix: cat.prefix || "", 
      description: cat.description || "", 
      image: cat.image || "" 
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
        setFormData(prev => ({ ...prev, image: data.data.url }));
        toast.success("Image uploaded successfully");
      } else {
        toast.error(data.message || "Failed to upload image");
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
      ? `${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/categories/${editingId}`
      : `${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/categories`;

    // Optimistic Update
    const optimisticData = editingId 
      ? categories.map((c: any) => c.id === editingId ? { ...c, ...formData } : c)
      : [...categories, { id: `temp-${Date.now()}`, ...formData }];
      
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
        toast.success(`Category ${editingId ? 'updated' : 'created'} successfully`);
        mutate();
      } else {
        toast.error(data.message || `Failed to ${editingId ? 'update' : 'create'} category`);
        mutate();
      }
    } catch (err) {
      toast.error("An error occurred");
      mutate();
    }
  };

  const deleteCategory = async () => {
    if (!deleteId) return;
    const currentDeleteId = deleteId;
    setDeleteId(null);
    
    mutate(categories.filter((c: any) => c.id !== currentDeleteId), false);
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/categories/${currentDeleteId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }});
      if (res.ok) {
        toast.success("Category deleted securely");
        mutate();
      } else {
        toast.error("Failed to delete category");
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
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">Manage your product categories and taxonomy.</p>
        </div>
        
        <div>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Category" : "Create Category"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              
              {/* Image Upload Area */}
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg bg-muted/30 relative">
                {formData.image ? (
                  <div className="relative w-24 h-24 rounded-md overflow-hidden mb-4">
                    <Image src={formData.image} alt="Category" fill className="object-cover" />
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
                  {isUploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</> : "Upload Category Image"}
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Category Name</Label>
                <Input 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Electronics" 
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Category description" 
                />
              </div>
              <div className="space-y-2">
                <Label>Barcode Prefix (2 chars)</Label>
                <Input 
                  value={formData.prefix}
                  maxLength={2}
                  onChange={(e) => setFormData({...formData, prefix: e.target.value.toUpperCase()})}
                  placeholder="e.g. EL" 
                />
              </div>
              <Button type="submit" className="w-full" disabled={isUploading}>
                {editingId ? "Update Category" : "Create Category"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Prefix</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">Loading...</TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No categories found.</TableCell>
              </TableRow>
            ) : (
              categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>
                    {cat.image ? (
                      <div className="w-10 h-10 rounded-md overflow-hidden relative border">
                        <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center text-xs text-muted-foreground border">
                        <ImageIcon className="h-4 w-4" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell className="text-muted-foreground">{cat.slug}</TableCell>
                  <TableCell className="font-mono">{cat.prefix || "-"}</TableCell>
                  <TableCell>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${cat.isActive ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'}`}>
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(cat)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(cat.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
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
              This action cannot be undone. This will permanently delete the category
              and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteCategory} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
