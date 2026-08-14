"use client";

import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Palette, Image as ImageIcon, Type, Upload } from "lucide-react";
import Image from "next/image";

export default function BrandingSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [theme, setTheme] = useState({
    primaryColor: "221.2 83.2% 53.3%",
    secondaryColor: "210 40% 96.1%",
    accentColor: "262.1 83.3% 57.8%",
    backgroundColor: "0 0% 100%",
    textColor: "222.2 84% 4.9%",
    fontFamily: "Inter",
    headingScale: "1.0",
    buttonRadius: "0.5rem",
    componentDensity: "comfortable",
    logoUrl: "",
    faviconUrl: "",
    appIconUrl: "",
    socialPreviewImage: ""
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<string>("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/store-settings`);
      const json = await res.json();
      if (json.success && json.data?.theme) {
        setTheme(prev => ({...prev, ...json.data.theme}));
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
        body: JSON.stringify({ theme }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Branding & Theme updated successfully!");
        // We could trigger a page reload or context update here to apply the theme immediately.
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
    if (!file || !uploadTarget) return;

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
        setTheme({ ...theme, [uploadTarget]: data.url });
        toast.success("Image uploaded successfully");
      } else {
        toast.error(data.message || "Upload failed");
      }
    } catch (err) {
      toast.error("Failed to upload image");
    }
  };

  const triggerUpload = (target: string) => {
    setUploadTarget(target);
    fileInputRef.current?.click();
  };

  if (isLoading) return <div className="p-8">Loading settings...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Branding & Theme</h1>
          <p className="text-muted-foreground mt-1">Customize your storefront&apos;s visual identity and brand assets.</p>
        </div>
        <Button onClick={saveSettings} disabled={isSaving} className="gap-2">
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
      
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Colors */}
        <div className="border border-border rounded-xl bg-card overflow-hidden">
          <div className="p-6 border-b border-border flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-lg">Brand Colors (HSL Format)</h2>
          </div>
          <div className="p-6 grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Primary Color</label>
              <Input 
                value={theme.primaryColor || ""} 
                onChange={(e) => setTheme({...theme, primaryColor: e.target.value})} 
                placeholder="221.2 83.2% 53.3%"
              />
              <p className="text-xs text-muted-foreground">Used for main buttons, active states, and highlights.</p>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Secondary Color</label>
              <Input 
                value={theme.secondaryColor || ""} 
                onChange={(e) => setTheme({...theme, secondaryColor: e.target.value})} 
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Accent Color</label>
              <Input 
                value={theme.accentColor || ""} 
                onChange={(e) => setTheme({...theme, accentColor: e.target.value})} 
              />
            </div>
          </div>
        </div>

        {/* Typography & UI */}
        <div className="border border-border rounded-xl bg-card overflow-hidden">
          <div className="p-6 border-b border-border flex items-center gap-2">
            <Type className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-lg">Typography & UI</h2>
          </div>
          <div className="p-6 grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Font Family</label>
              <select 
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={theme.fontFamily || "Inter"}
                onChange={(e) => setTheme({...theme, fontFamily: e.target.value})}
              >
                <option value="Inter">Inter (Modern, Clean)</option>
                <option value="Roboto">Roboto (Technical)</option>
                <option value="Playfair Display">Playfair Display (Elegant, Serif)</option>
                <option value="Outfit">Outfit (Geometric, Trendy)</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Button Radius</label>
                <select 
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={theme.buttonRadius || "0.5rem"}
                  onChange={(e) => setTheme({...theme, buttonRadius: e.target.value})}
                >
                  <option value="0">Square (0px)</option>
                  <option value="0.3rem">Slight (0.3rem)</option>
                  <option value="0.5rem">Medium (0.5rem)</option>
                  <option value="9999px">Pill (Fully Rounded)</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Component Density</label>
                <select 
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={theme.componentDensity || "comfortable"}
                  onChange={(e) => setTheme({...theme, componentDensity: e.target.value})}
                >
                  <option value="compact">Compact</option>
                  <option value="comfortable">Comfortable</option>
                  <option value="spacious">Spacious</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Assets */}
        <div className="border border-border rounded-xl bg-card overflow-hidden xl:col-span-2">
          <div className="p-6 border-b border-border flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-lg">Brand Assets</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Logo */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Main Logo</label>
              <div className="aspect-video relative rounded-lg border border-dashed border-border bg-muted/50 flex flex-col items-center justify-center overflow-hidden">
                {theme.logoUrl ? (
                  <Image src={theme.logoUrl} alt="Logo" fill className="object-contain p-4" />
                ) : (
                  <span className="text-xs text-muted-foreground">No Logo</span>
                )}
              </div>
              <Button variant="outline" size="sm" className="w-full" onClick={() => triggerUpload("logoUrl")}>
                <Upload className="h-4 w-4 mr-2" /> Upload Logo
              </Button>
            </div>

            {/* Favicon */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Favicon</label>
              <div className="aspect-square relative rounded-lg border border-dashed border-border bg-muted/50 flex flex-col items-center justify-center overflow-hidden max-w-[150px] mx-auto">
                {theme.faviconUrl ? (
                  <Image src={theme.faviconUrl} alt="Favicon" fill className="object-contain p-4" />
                ) : (
                  <span className="text-xs text-muted-foreground">No Favicon</span>
                )}
              </div>
              <Button variant="outline" size="sm" className="w-full max-w-[150px] mx-auto flex" onClick={() => triggerUpload("faviconUrl")}>
                <Upload className="h-4 w-4 mr-2" /> Upload
              </Button>
            </div>

            {/* App Icon */}
            <div className="space-y-3">
              <label className="text-sm font-medium">App Icon (PWA)</label>
              <div className="aspect-square relative rounded-lg border border-dashed border-border bg-muted/50 flex flex-col items-center justify-center overflow-hidden max-w-[150px] mx-auto">
                {theme.appIconUrl ? (
                  <Image src={theme.appIconUrl} alt="App Icon" fill className="object-cover" />
                ) : (
                  <span className="text-xs text-muted-foreground">No Icon</span>
                )}
              </div>
              <Button variant="outline" size="sm" className="w-full max-w-[150px] mx-auto flex" onClick={() => triggerUpload("appIconUrl")}>
                <Upload className="h-4 w-4 mr-2" /> Upload
              </Button>
            </div>

            {/* Social Preview */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Social Preview Image</label>
              <div className="aspect-video relative rounded-lg border border-dashed border-border bg-muted/50 flex flex-col items-center justify-center overflow-hidden">
                {theme.socialPreviewImage ? (
                  <Image src={theme.socialPreviewImage} alt="Social Preview" fill className="object-cover" />
                ) : (
                  <span className="text-xs text-muted-foreground text-center px-4">Used for Open Graph (1200x630)</span>
                )}
              </div>
              <Button variant="outline" size="sm" className="w-full" onClick={() => triggerUpload("socialPreviewImage")}>
                <Upload className="h-4 w-4 mr-2" /> Upload Image
              </Button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
