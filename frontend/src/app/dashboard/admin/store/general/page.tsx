"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Globe, Building2, MapPin, Phone, Mail } from "lucide-react";

export default function GeneralSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [identity, setIdentity] = useState({ companyName: "" });
  const [businessProfile, setBusinessProfile] = useState({
    address: "",
    hotline: "",
    email: "",
    taxId: "",
  });
  const [localization, setLocalization] = useState({
    currency: "USD",
    locale: "en-US",
    language: "English",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/store-settings`);
      const json = await res.json();
      if (json.success && json.data) {
        setIdentity(json.data.identity || { companyName: "" });
        setBusinessProfile(json.data.businessProfile || { address: "", hotline: "", email: "", taxId: "" });
        setLocalization(json.data.localization || { currency: "USD", locale: "en-US", language: "English" });
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
        body: JSON.stringify({
          identity,
          businessProfile,
          localization
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("General settings updated successfully!");
      } else {
        toast.error("Failed to update settings");
      }
    } catch (err) {
      toast.error("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8">Loading settings...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">General Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your business profile and localization options.</p>
        </div>
        <Button onClick={saveSettings} disabled={isSaving} className="gap-2">
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid gap-8">
        {/* Identity & Business Profile */}
        <div className="border border-border rounded-xl bg-card overflow-hidden">
          <div className="p-6 border-b border-border flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-lg">Business Identity</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Company / Store Name</label>
              <Input 
                value={identity.companyName} 
                onChange={(e) => setIdentity({...identity, companyName: e.target.value})} 
                placeholder="e.g. Neurosoftic"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium flex items-center gap-2"><Phone className="h-3.5 w-3.5"/> Support Hotline</label>
                <Input 
                  value={businessProfile.hotline} 
                  onChange={(e) => setBusinessProfile({...businessProfile, hotline: e.target.value})} 
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium flex items-center gap-2"><Mail className="h-3.5 w-3.5"/> Support Email</label>
                <Input 
                  value={businessProfile.email} 
                  onChange={(e) => setBusinessProfile({...businessProfile, email: e.target.value})} 
                  placeholder="support@store.com"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium flex items-center gap-2"><MapPin className="h-3.5 w-3.5"/> Business Address</label>
              <Input 
                value={businessProfile.address} 
                onChange={(e) => setBusinessProfile({...businessProfile, address: e.target.value})} 
                placeholder="123 Commerce St, City, Country"
              />
            </div>
          </div>
        </div>

        {/* Localization */}
        <div className="border border-border rounded-xl bg-card overflow-hidden">
          <div className="p-6 border-b border-border flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-lg">Localization</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Default Currency</label>
              <select 
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={localization.currency}
                onChange={(e) => setLocalization({...localization, currency: e.target.value})}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="BDT">BDT (৳)</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Language</label>
              <select 
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={localization.language}
                onChange={(e) => setLocalization({...localization, language: e.target.value})}
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="Bengali">Bengali</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
