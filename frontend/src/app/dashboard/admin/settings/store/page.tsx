/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Save, UploadCloud, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function StoreSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Settings State
  const [companyName, setCompanyName] = useState("");
  const [primaryColor, setPrimaryColor] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");
  const [fontFamily, setFontFamily] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [banners, setBanners] = useState<
    {
      id?: string;
      title: string;
      imageUrl: string;
      linkUrl: string;
      position?: string;
      sortOrder: number;
      isActive: boolean;
    }[]
  >([]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/store-settings`,
        );
        if (res.ok) {
          const data = await res.json();
          setCompanyName(data.data.identity.companyName || "");
          setPrimaryColor(data.data.theme.primaryColor || "");
          setSecondaryColor(data.data.theme.secondaryColor || "");
          setFontFamily(data.data.theme.fontFamily || "");
          setLogoUrl(data.data.theme.logoUrl || "");
          setBanners(data.data.banners || []);
        }
      } catch (err) {
        toast.error("Failed to load store settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string) => void,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const toastId = toast.loading("Uploading image...");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await res.json();
      if (res.ok && data.success) {
        setter(data.data.url);
        toast.success("Image uploaded successfully", { id: toastId });
      } else {
        toast.error(data.message || "Upload failed", { id: toastId });
      }
    } catch (err) {
      toast.error("An error occurred during upload", { id: toastId });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/store-settings`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            identity: { companyName },
            theme: { primaryColor, secondaryColor, fontFamily, logoUrl },
            banners: banners,
          }),
        },
      );
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(
          "Store settings updated successfully! Refresh to see changes.",
        );
      } else {
        toast.error(data.message || "Failed to update settings");
      }
    } catch (err) {
      toast.error("An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  const addBanner = () => {
    setBanners([
      ...banners,
      {
        title: "New Banner",
        imageUrl: "",
        linkUrl: "",
        position: "HERO",
        sortOrder: banners.length,
        isActive: true,
      },
    ]);
  };

  const removeBanner = (index: number) => {
    const newBanners = [...banners];
    newBanners.splice(index, 1);
    setBanners(newBanners);
  };

  const updateBanner = (index: number, field: string, value: any) => {
    const newBanners = [...banners];
    (newBanners[index] as any)[field] = value;
    setBanners(newBanners);
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Storefront Identity
          </h1>
          <p className="text-muted-foreground">
            Manage your brand&apos;s appearance across the entire store
            dynamically.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} size="lg">
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      <Tabs defaultValue="identity" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-3 mb-8">
          <TabsTrigger value="identity">Identity & Brand</TabsTrigger>
          <TabsTrigger value="theme">Colors & Typography</TabsTrigger>
          <TabsTrigger value="banners">Banners</TabsTrigger>
        </TabsList>

        <TabsContent value="identity">
          <Card>
            <CardHeader>
              <CardTitle>Brand Identity</CardTitle>
              <CardDescription>
                Configure your core brand elements like name and logo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Company Name</label>
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Neurosoftic"
                />
                <p className="text-xs text-muted-foreground">
                  This is displayed in the navigation and emails.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Logo</label>
                <div className="flex gap-4 items-start">
                  <div className="relative">
                    <Button variant="outline">
                      <UploadCloud className="h-4 w-4 mr-2" /> Upload Logo
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => handleFileUpload(e, setLogoUrl)}
                    />
                  </div>
                  {logoUrl && (
                    <div className="p-4 border rounded-md bg-muted/50 inline-block relative group">
                      <img
                        src={logoUrl}
                        alt="Logo preview"
                        className="h-12 w-auto"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 hidden group-hover:flex rounded-full"
                        onClick={() => setLogoUrl("")}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>
                Set the global CSS variables. Supports Hex (#3b82f6), HSL (221.2
                83.2% 53.3%), or oklch.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Primary Color (HSL)
                  </label>
                  <Input
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    placeholder="221.2 83.2% 53.3%"
                  />
                  <div
                    className="h-8 w-full rounded-md mt-2 border"
                    style={{ backgroundColor: `hsl(${primaryColor})` }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Secondary Color (HSL)
                  </label>
                  <Input
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    placeholder="210 40% 96.1%"
                  />
                  <div
                    className="h-8 w-full rounded-md mt-2 border"
                    style={{ backgroundColor: `hsl(${secondaryColor})` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Font Family</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                >
                  <option value="Inter">Inter (Default)</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Playfair Display">Playfair Display</option>
                  <option value="Outfit">Outfit</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banners">
          <Card>
            <CardHeader>
              <CardTitle>Banners</CardTitle>
              <CardDescription>
                Manage hero and promotional banners for the storefront.
              </CardDescription>
              <CardAction>
                <Button onClick={addBanner} size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Add Banner
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="space-y-6">
              {banners.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border rounded-md border-dashed">
                  No banners configured. Click Add Banner to create one.
                </div>
              ) : (
                <div className="space-y-6">
                  {banners.map((banner, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-md space-y-4 bg-muted/20"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">Banner #{index + 1}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeBanner(index)}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <div className="space-y-2">
                          <label className="text-xs font-medium">
                            Title (Internal)
                          </label>
                          <Input
                            value={banner.title}
                            onChange={(e) =>
                              updateBanner(index, "title", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium">
                            Link URL (Optional)
                          </label>
                          <Input
                            value={banner.linkUrl}
                            onChange={(e) =>
                              updateBanner(index, "linkUrl", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium">
                            Banner Type
                          </label>
                          <select
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            value={banner.position || "HERO"}
                            onChange={(e) =>
                              updateBanner(index, "position", e.target.value)
                            }
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
                              onChange={(e) =>
                                updateBanner(
                                  index,
                                  "isActive",
                                  e.target.checked,
                                )
                              }
                              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span>Active / Visible</span>
                          </label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-medium">
                          Banner Image
                        </label>
                        <div className="flex gap-4 items-start">
                          <div className="relative">
                            <Button variant="outline" size="sm">
                              <UploadCloud className="h-4 w-4 mr-2" /> Upload
                              Image
                            </Button>
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={(e) =>
                                handleFileUpload(e, (url) =>
                                  updateBanner(index, "imageUrl", url),
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>

                      {banner.imageUrl && (
                        <div className="mt-2 h-32 w-full border rounded-md overflow-hidden relative group">
                          <img
                            src={banner.imageUrl}
                            className="w-full h-full object-cover"
                            alt="Banner preview"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 hidden group-hover:flex rounded-md shadow-md"
                            onClick={() => updateBanner(index, "imageUrl", "")}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end pt-6 border-t border-border mt-8">
        <Button onClick={handleSave} disabled={saving} size="lg">
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
