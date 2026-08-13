"use client";

import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Image as ImageIcon, Layout, Plus, Trash2, Upload } from "lucide-react";
import Image from "next/image";

export default function HomeLayoutSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [banners, setBanners] = useState<any[]>([]);
  const [homeLayout, setHomeLayout] = useState<any>({
    sections: {
      AnnouncementBar: true,
      HeroSlider: true,
      FeaturedCategories: true,
      LatestCollection: true,
      PromotionalBanner: true,
      CollectionGrid: true,
      BestSellers: true,
      SplitPromoBlock: true,
      BrandStrip: true,
      EditorialStory: true,
      VideoSection: true,
      TrustUSP: true,
      Testimonials: true,
      SocialFeed: true,
      FAQSection: true,
      Newsletter: true
    }
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadIndex, setUploadIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/store-settings`);
      const json = await res.json();
      if (json.success) {
        setBanners(json.data?.banners || []);
        if (json.data?.homeLayout?.sections) {
          setHomeLayout(json.data.homeLayout);
        }
      }
    } catch (err) {
      toast.error("Failed to fetch settings");
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/store-settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ banners, homeLayout }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Home Layout updated successfully!");
        setBanners(json.data.banners || []);
      } else {
        toast.error("Failed to update settings");
      }
    } catch (err) {
      toast.error("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  const addBanner = () => {
    setBanners([...banners, { title: "", imageUrl: "", linkUrl: "", position: "HERO", sortOrder: banners.length, isActive: true }]);
  };

  const removeBanner = (index: number) => {
    setBanners(banners.filter((_, i) => i !== index));
  };

  const updateBanner = (index: number, field: string, value: any) => {
    const newBanners = [...banners];
    newBanners[index][field] = value;
    setBanners(newBanners);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || uploadIndex === null) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/upload`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        updateBanner(uploadIndex, "imageUrl", data.url);
        toast.success("Image uploaded successfully");
      } else {
        toast.error(data.message || "Upload failed");
      }
    } catch (err) {
      toast.error("Failed to upload image");
    }
    setUploadIndex(null);
  };

  const toggleSection = (sectionName: string) => {
    setHomeLayout({
      ...homeLayout,
      sections: {
        ...homeLayout.sections,
        [sectionName]: !homeLayout.sections[sectionName]
      }
    });
  };

  if (isLoading) return <div className="p-8">Loading settings...</div>;

  const sectionKeys = Object.keys(homeLayout.sections);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Home Layout</h1>
          <p className="text-muted-foreground mt-1">Manage homepage sections, ordering, and merchandising banners.</p>
        </div>
        <Button onClick={saveSettings} disabled={isSaving} className="gap-2">
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
      
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Section Visibility */}
        <div className="border border-border rounded-xl bg-card overflow-hidden h-max">
          <div className="p-6 border-b border-border flex items-center gap-2">
            <Layout className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-lg">Section Visibility</h2>
          </div>
          <div className="p-4 space-y-1">
            {sectionKeys.map((key) => (
              <label key={key} className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50 cursor-pointer transition-colors">
                <span className="text-sm font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <input 
                  type="checkbox" 
                  checked={homeLayout.sections[key]} 
                  onChange={() => toggleSection(key)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Banners */}
        <div className="border border-border rounded-xl bg-card overflow-hidden xl:col-span-2">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-lg">Campaign Banners</h2>
            </div>
            <Button onClick={addBanner} size="sm" variant="outline" className="gap-2">
              <Plus className="h-4 w-4" /> Add Banner
            </Button>
          </div>
          <div className="p-6 space-y-6">
            {banners.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No banners configured. Add a banner to display it on your storefront.
              </div>
            ) : (
              banners.map((banner, index) => (
                <div key={index} className="border border-border/50 rounded-lg p-5 bg-muted/20 relative group">
                  <button 
                    onClick={() => removeBanner(index)}
                    className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Image Preview */}
                    <div className="w-full md:w-48 space-y-2">
                      <div className="aspect-[21/9] md:aspect-square relative rounded-md border border-dashed border-border bg-background flex flex-col items-center justify-center overflow-hidden">
                        {banner.imageUrl ? (
                          <Image src={banner.imageUrl} alt="Banner" fill className="object-cover" />
                        ) : (
                          <span className="text-xs text-muted-foreground">No Image</span>
                        )}
                      </div>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="w-full text-xs" 
                        onClick={() => { setUploadIndex(index); fileInputRef.current?.click(); }}
                      >
                        <Upload className="h-3 w-3 mr-2" /> Upload
                      </Button>
                    </div>

                    {/* Banner Settings */}
                    <div className="flex-1">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-xs font-medium">Title (Internal)</label>
                          <Input 
                            className="h-9"
                            value={banner.title} 
                            onChange={(e) => updateBanner(index, "title", e.target.value)} 
                            placeholder="Summer Sale 2026"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium">Link URL</label>
                          <Input 
                            className="h-9"
                            value={banner.linkUrl || ""} 
                            onChange={(e) => updateBanner(index, "linkUrl", e.target.value)} 
                            placeholder="/collections/summer"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium">Placement Area</label>
                          <select 
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            value={banner.position || "HERO"}
                            onChange={(e) => updateBanner(index, "position", e.target.value)}
                          >
                            <option value="HERO">Home Page Hero</option>
                            <option value="PROMO">Promotional Strip</option>
                            <option value="CATEGORY">Category Header</option>
                          </select>
                        </div>
                        <div className="space-y-2 flex flex-col justify-end">
                          <label className="text-xs font-medium flex items-center cursor-pointer gap-2 h-9">
                            <input 
                              type="checkbox" 
                              checked={banner.isActive !== false} 
                              onChange={(e) => updateBanner(index, "isActive", e.target.checked)}
                              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span>Active / Visible on Store</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
