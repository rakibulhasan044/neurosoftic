"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Barcode as BarcodeIcon, Printer, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function AdminBarcodesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedVariant, setSelectedVariant] = useState("");
  const [generatedBarcode, setGeneratedBarcode] = useState<string | null>(null);

  // Fetch categories and variants on load
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [catRes, varRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/categories`),
          fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/inventory`) // reuse inventory for variants
        ]);
        
        if (catRes.ok) {
          const data = await catRes.json();
          setCategories(data.data || []);
        }
        if (varRes.ok) {
          const data = await varRes.json();
          setVariants(data.variants || []);
        }
      } catch (error) {
        console.error("Failed to fetch initial data", error);
      }
    };
    fetchInitialData();
  }, []);

  const handleGenerateBarcode = async () => {
    if (!selectedCategory || !selectedVariant) {
      toast.error("Please select both a category and a variant.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/barcodes/generate`, {
        method: 'POST',
        headers: { 
        "Authorization": `Bearer ${localStorage.getItem("token")}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId: selectedCategory,
          variantId: selectedVariant
        })
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedBarcode(data.data.barcode);
        toast.success("Barcode generated successfully!");
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to generate barcode");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during barcode generation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Barcode Generator</h1>
          <p className="text-muted-foreground">Generate 12-digit standardized barcodes for product variants.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Generator Settings</CardTitle>
            <CardDescription>Select the product attributes to generate a unique code.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category Prefix</label>
              <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v || "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c: any) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">The first two digits will be based on the category prefix.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Product Variant</label>
              <Select value={selectedVariant} onValueChange={(v) => setSelectedVariant(v || "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a variant" />
                </SelectTrigger>
                <SelectContent>
                  {variants.map((v: any) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.product?.name} - {v.sku || 'No SKU'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">The 4-digit variant code will be injected into the barcode.</p>
            </div>

            <Button 
              className="w-full mt-4" 
              onClick={handleGenerateBarcode}
              disabled={loading || !selectedCategory || !selectedVariant}
            >
              {loading ? "Generating..." : "Generate Barcode"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated Result</CardTitle>
            <CardDescription>Preview the generated barcode for printing.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-[250px] bg-muted/30 border rounded-lg m-6 mt-0 relative">
            {generatedBarcode ? (
              <div className="text-center space-y-4">
                <div className="flex flex-col items-center p-6 bg-white border-2 border-black rounded shadow-sm">
                  {/* Mock Barcode Graphic */}
                  <div className="flex h-16 w-48 mb-2">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div key={i} className={`h-full ${Math.random() > 0.5 ? 'bg-black w-1' : 'bg-transparent w-[2px]'}`}></div>
                    ))}
                  </div>
                  <span className="font-mono tracking-[0.3em] font-bold text-black">{generatedBarcode}</span>
                </div>
                <Button variant="outline" className="w-full">
                  <Printer className="mr-2 h-4 w-4" /> Print Label
                </Button>
              </div>
            ) : (
              <div className="text-muted-foreground flex flex-col items-center gap-2">
                <BarcodeIcon className="h-10 w-10 opacity-20" />
                <p>No barcode generated yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
