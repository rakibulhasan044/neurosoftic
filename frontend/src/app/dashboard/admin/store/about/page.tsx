"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save, UploadCloud } from "lucide-react";
import Image from "next/image";

export default function AboutSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [about, setAbout] = useState({
    title: "",
    story: "",
    mission: "",
    vision: "",
    heroImage: ""
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/store-settings`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }});
      if (res.ok) {
        const data = await res.json();
        if (data.data?.about) {
          setAbout(data.data.about);
        }
      }
    } catch (error) {
      toast.error("Failed to load about page settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/store-settings`, {
        method: "PATCH",
        headers: { 
        "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          },
        body: JSON.stringify({ about })
      });
      
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("About page settings saved successfully");
      } else {
        toast.error(data.message || "Failed to save settings");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    const uploadToast = toast.loading("Uploading image...");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/upload`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAbout({ ...about, heroImage: data.data.url });
        toast.success("Image uploaded successfully", { id: uploadToast });
      } else {
        toast.error(data.message || "Failed to upload image", { id: uploadToast });
      }
    } catch (error) {
      toast.error("An error occurred during upload", { id: uploadToast });
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">About Page Configuration</h1>
          <p className="text-muted-foreground">Manage the content displayed on your public About Us page.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="min-w-[120px]">
          {saving ? "Saving..." : (
            <>
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
          <CardDescription>The main headline and banner image for the about page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Page Title / Headline</Label>
            <Input 
              value={about.title} 
              onChange={e => setAbout({...about, title: e.target.value})} 
              placeholder="e.g. About Neurosoftic"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Hero Image (Banner)</Label>
            <div className="flex flex-col gap-4">
              {about.heroImage && (
                <div className="relative h-48 w-full md:w-1/2 rounded-md overflow-hidden bg-muted border border-border">
                  <Image src={about.heroImage} alt="Hero" fill className="object-cover" />
                </div>
              )}
              <div className="flex items-center gap-4">
                <Button variant="outline" render={<label className="cursor-pointer flex items-center" />}>
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Upload Image
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </Button>
                {about.heroImage && (
                  <Button variant="ghost" className="text-destructive" onClick={() => setAbout({...about, heroImage: ""})}>
                    Remove Image
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Our Story</CardTitle>
          <CardDescription>Tell the story of how your brand started and what it stands for.</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea 
            value={about.story} 
            onChange={e => setAbout({...about, story: e.target.value})} 
            placeholder="Write your company's story here..."
            className="min-h-[200px]"
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mission Statement</CardTitle>
            <CardDescription>What is your primary mission?</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea 
              value={about.mission} 
              onChange={e => setAbout({...about, mission: e.target.value})} 
              placeholder="e.g. To deliver premium tech to everyone."
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Vision Statement</CardTitle>
            <CardDescription>What is your long-term vision?</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea 
              value={about.vision} 
              onChange={e => setAbout({...about, vision: e.target.value})} 
              placeholder="e.g. A world connected by seamless innovation."
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
