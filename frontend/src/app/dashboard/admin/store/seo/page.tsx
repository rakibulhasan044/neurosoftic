"use client";

import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, Search, Upload, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export default function SEOSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [seo, setSeo] = useState({
    title: "",
    description: "",
    keywords: "",
    ogImage: ""
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/store-settings`);
      const json = await res.json();
      if (json.success && json.data?.seo) {
        setSeo(json.data.seo);
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
        headers: { 
        "Authorization": `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json", },
        body: JSON.stringify({ seo }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("SEO settings updated successfully!");
      } else {
        toast.error("Failed to update settings");
      }
    } catch (err) {
      toast.error("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/upload`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        setSeo({ ...seo, ogImage: data.url });
        toast.success("Image uploaded successfully");
      } else {
        toast.error(data.message || "Upload failed");
      }
    } catch (err) {
      toast.error("Failed to upload image");
    }
  };

  if (isLoading) return <div className="p-8">Loading settings...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SEO Settings</h1>
          <p className="text-muted-foreground mt-1">Manage meta tags and social preview for search engines.</p>
        </div>
        <Button onClick={saveSettings} disabled={isSaving} className="gap-2">
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
      
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Metadata Form */}
        <div className="border border-border rounded-xl bg-card overflow-hidden">
          <div className="p-6 border-b border-border flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-lg">Global Metadata</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Site Title</label>
              <Input 
                value={seo.title || ""} 
                onChange={(e) => setSeo({...seo, title: e.target.value})} 
                placeholder="Neurosoftic | Premium Electronics"
              />
              <p className="text-xs text-muted-foreground">The default title shown in browser tabs and search results.</p>
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">Meta Description</label>
              <Textarea 
                value={seo.description || ""} 
                onChange={(e) => setSeo({...seo, description: e.target.value})} 
                placeholder="Discover premium electronics, from high-fidelity audio to cutting-edge smart home devices."
                rows={4}
              />
              <p className="text-xs text-muted-foreground">A brief summary of your store. Recommended length: 150-160 characters.</p>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Keywords</label>
              <Input 
                value={seo.keywords || ""} 
                onChange={(e) => setSeo({...seo, keywords: e.target.value})} 
                placeholder="electronics, audio, smart home, premium"
              />
              <p className="text-xs text-muted-foreground">Comma-separated keywords relevant to your store.</p>
            </div>
          </div>
        </div>

        {/* Preview and Open Graph */}
        <div className="space-y-8">
          <div className="border border-border rounded-xl bg-card overflow-hidden">
            <div className="p-6 border-b border-border flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-lg">Open Graph Image</h2>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-muted-foreground">This image is displayed when your store is shared on social media (Facebook, Twitter, LinkedIn).</p>
              
              <div className="aspect-[1.91/1] relative rounded-lg border border-dashed border-border bg-muted/50 flex flex-col items-center justify-center overflow-hidden">
                {seo.ogImage ? (
                  <Image src={seo.ogImage} alt="Open Graph" fill className="object-cover" />
                ) : (
                  <span className="text-xs text-muted-foreground text-center px-4">Recommended size: 1200 x 630 pixels</span>
                )}
              </div>
              <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" /> Upload OG Image
              </Button>
            </div>
          </div>

          {/* Google Search Preview */}
          <div className="border border-border rounded-xl bg-card overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="font-semibold text-lg">Search Engine Preview</h2>
            </div>
            <div className="p-6 bg-white dark:bg-[#202124] rounded-b-xl">
              <div className="text-[14px] text-[#202124] dark:text-[#dadce0] mb-[2px]">
                https://yourstore.com
              </div>
              <div className="text-[20px] text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer truncate mb-1">
                {seo.title || "Neurosoftic | Premium Electronics"}
              </div>
              <div className="text-[14px] text-[#4d5156] dark:text-[#bdc1c6] line-clamp-2">
                {seo.description || "Discover premium electronics, from high-fidelity audio to cutting-edge smart home devices."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
