"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ProductsFilterClientProps {
  categories: any[];
  brands: any[];
  currentParams: Record<string, string>;
}

export function ProductsFilterClient({ categories, brands, currentParams }: ProductsFilterClientProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  
  // Local state for the filters
  const [category, setCategory] = useState(currentParams?.category || "");
  const [brand, setBrand] = useState(currentParams?.brand || "");
  const [sort, setSort] = useState(currentParams?.sort || "");

  const applyFilters = () => {
    const query = new URLSearchParams();
    if (category) query.append("category", category);
    if (brand) query.append("brand", brand);
    if (sort) query.append("sort", sort);
    
    router.push(`/products?${query.toString()}`);
    setIsOpen(false);
  };

  const clearFilters = () => {
    setCategory("");
    setBrand("");
    setSort("");
    router.push("/products");
    setIsOpen(false);
  };

  const activeFiltersCount = [category, brand, sort].filter(Boolean).length;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 rounded-full relative">
          <Filter className="h-4 w-4" /> 
          Filter & Sort
          {activeFiltersCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[350px] sm:w-[450px] overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Filters & Sorting</SheetTitle>
          <SheetDescription>
            Narrow down your product search to find exactly what you need.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-8">
          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Category</h3>
            <RadioGroup value={category} onValueChange={setCategory}>
              <div className="flex items-center space-x-2 py-1">
                <RadioGroupItem value="" id="cat-all" />
                <Label htmlFor="cat-all">All Categories</Label>
              </div>
              {categories.map((c) => (
                <div key={c.id} className="flex items-center space-x-2 py-1">
                  <RadioGroupItem value={c.slug} id={`cat-${c.id}`} />
                  <Label htmlFor={`cat-${c.id}`}>{c.name}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Brands */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Brand</h3>
            <RadioGroup value={brand} onValueChange={setBrand}>
              <div className="flex items-center space-x-2 py-1">
                <RadioGroupItem value="" id="brand-all" />
                <Label htmlFor="brand-all">All Brands</Label>
              </div>
              {brands.map((b) => (
                <div key={b.id} className="flex items-center space-x-2 py-1">
                  <RadioGroupItem value={b.slug} id={`brand-${b.id}`} />
                  <Label htmlFor={`brand-${b.id}`}>{b.name}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Sorting */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Sort By</h3>
            <RadioGroup value={sort} onValueChange={setSort}>
              <div className="flex items-center space-x-2 py-1">
                <RadioGroupItem value="" id="sort-default" />
                <Label htmlFor="sort-default">Default (Featured)</Label>
              </div>
              <div className="flex items-center space-x-2 py-1">
                <RadioGroupItem value="newest" id="sort-newest" />
                <Label htmlFor="sort-newest">Newest Arrivals</Label>
              </div>
              <div className="flex items-center space-x-2 py-1">
                <RadioGroupItem value="price-asc" id="sort-price-asc" />
                <Label htmlFor="sort-price-asc">Price: Low to High</Label>
              </div>
              <div className="flex items-center space-x-2 py-1">
                <RadioGroupItem value="price-desc" id="sort-price-desc" />
                <Label htmlFor="sort-price-desc">Price: High to Low</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="pt-6 flex flex-col gap-3">
            <Button onClick={applyFilters} className="w-full">
              Apply Filters
            </Button>
            <Button onClick={clearFilters} variant="outline" className="w-full">
              Clear All
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
