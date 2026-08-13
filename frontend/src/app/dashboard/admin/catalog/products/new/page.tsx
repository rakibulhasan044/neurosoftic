"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Trash2, Wand2, Image as ImageIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    categoryId: "",
    brandId: "",
    status: "DRAFT"
  });
  
  const [primaryImage, setPrimaryImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [variants, setVariants] = useState<any[]>([
    { variantCode: "0001", size: "", color: "", price: 0, stock: 0, sku: "", barcode: "" }
  ]);

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/categories`);
    const data = await res.json();
    if (data.success) setCategories(data.data);
  };

  const fetchBrands = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/brands`);
    const data = await res.json();
    if (data.success) setBrands(data.data);
  };

  const generateBarcode = async (index: number) => {
    if (!formData.categoryId) {
      toast.error("Please select a category first");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/barcodes/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          categoryId: formData.categoryId,
          variantCode: variants[index].variantCode
        })
      });
      const data = await res.json();
      
      if (data.success) {
        const newVariants = [...variants];
        newVariants[index].barcode = data.data.barcode;
        newVariants[index].sku = data.data.sku;
        setVariants(newVariants);
        toast.success("Barcode generated successfully");
      } else {
        toast.error("Failed to generate barcode");
      }
    } catch (error) {
      toast.error("Error generating barcode");
    }
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
        headers: { "Authorization": `Bearer ${token}` },
        body: fd
      });
      
      const data = await res.json();
      if (data.success) {
        setPrimaryImage(data.data.url);
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
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        variants: {
          create: variants.map(v => ({
            sku: v.sku || `SKU-${Date.now()}-${Math.floor(Math.random()*1000)}`,
            barcode: v.barcode,
            variantCode: v.variantCode,
            size: v.size,
            color: v.color,
            price: Number(v.price),
            stock: Number(v.stock)
          }))
        },
        ...(primaryImage ? {
          media: {
            create: [{ url: primaryImage, isPrimary: true, type: "IMAGE" }]
          }
        } : {})
      };

      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success("Product created successfully!");
        router.push("/dashboard/admin/catalog/products");
      } else {
        toast.error(data.message || "Failed to create product");
      }
    } catch (error) {
      toast.error("An error occurred during submission");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/admin/catalog/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
          <p className="text-muted-foreground">Create a new master product and configure its variants.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Master Info Section */}
        <div className="bg-card border rounded-lg p-6 space-y-6">
          <h2 className="text-xl font-semibold">1. Master Information</h2>
          
          {/* Media Upload Area */}
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg bg-muted/30 relative">
            {primaryImage ? (
              <div className="relative w-48 h-48 rounded-md overflow-hidden mb-4">
                <img src={primaryImage} alt="Product Media" className="object-cover w-full h-full" />
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
              {isUploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</> : "Upload Product Image"}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Product Name</Label>
              <Input required value={formData.name} onChange={e => {
                const name = e.target.value;
                setFormData({...formData, name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-')});
              }} />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Category</Label>
              <select required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})}>
                <option value="">Select a category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name} ({c.prefix || 'No prefix'})</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Brand (Optional)</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={formData.brandId} onChange={e => setFormData({...formData, brandId: e.target.value})}>
                <option value="">Select a brand</option>
                {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Active</option>
              </select>
            </div>
          </div>
        </div>

        {/* Variants Section */}
        <div className="bg-card border rounded-lg p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">2. Variants & Barcodes</h2>
            <Button type="button" variant="outline" onClick={() => setVariants([...variants, { variantCode: "000" + (variants.length + 1), size: "", color: "", price: 0, stock: 0, sku: "", barcode: "" }])}>
              <Plus className="mr-2 h-4 w-4" /> Add Variant
            </Button>
          </div>
          
          <div className="space-y-4">
            {variants.map((variant, index) => (
              <div key={index} className="border p-4 rounded-md relative bg-muted/20">
                <div className="absolute top-2 right-2">
                  <Button type="button" variant="ghost" size="icon" className="text-red-500" onClick={() => {
                    const newV = [...variants];
                    newV.splice(index, 1);
                    setVariants(newV);
                  }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-12 gap-4 items-end">
                  <div className="col-span-2 space-y-2">
                    <Label>Variant Code (4-digit)</Label>
                    <Input value={variant.variantCode} onChange={e => {
                      const newV = [...variants];
                      newV[index].variantCode = e.target.value;
                      setVariants(newV);
                    }} />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Size / Capacity</Label>
                    <Input placeholder="e.g. XL or 256GB" value={variant.size} onChange={e => {
                      const newV = [...variants];
                      newV[index].size = e.target.value;
                      setVariants(newV);
                    }} />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Color / Finish</Label>
                    <Input placeholder="e.g. Red" value={variant.color} onChange={e => {
                      const newV = [...variants];
                      newV[index].color = e.target.value;
                      setVariants(newV);
                    }} />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Price ($)</Label>
                    <Input type="number" required min="0" step="0.01" value={variant.price} onChange={e => {
                      const newV = [...variants];
                      newV[index].price = parseFloat(e.target.value);
                      setVariants(newV);
                    }} />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Stock</Label>
                    <Input type="number" required min="0" value={variant.stock} onChange={e => {
                      const newV = [...variants];
                      newV[index].stock = parseInt(e.target.value);
                      setVariants(newV);
                    }} />
                  </div>
                </div>

                <div className="mt-4 p-4 bg-background border rounded-md grid grid-cols-2 gap-4 items-center">
                  <div>
                    <Label className="text-xs text-muted-foreground">SKU / Serial</Label>
                    <div className="font-mono text-sm font-semibold">{variant.sku || "Not generated"}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <Label className="text-xs text-muted-foreground">12-Digit Barcode</Label>
                      <div className="font-mono text-sm font-bold text-primary">{variant.barcode || "Not generated"}</div>
                    </div>
                    <Button type="button" size="sm" variant="secondary" onClick={() => generateBarcode(index)}>
                      <Wand2 className="mr-2 h-4 w-4" /> Auto-Generate
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button size="lg" type="submit" disabled={isLoading || isUploading} className="w-48">
            {isLoading ? "Saving..." : "Save Product"}
          </Button>
        </div>

      </form>
    </div>
  );
}
