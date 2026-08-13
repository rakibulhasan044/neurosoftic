"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save, ShieldAlert, Truck, RotateCcw, FileText, Lock } from "lucide-react";

export default function LegalSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [legal, setLegal] = useState({
    shippingPolicy: "",
    returnPolicy: "",
    privacyPolicy: "",
    termsOfService: "",
    checkoutNotice: ""
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/store-settings`);
      const json = await res.json();
      if (json.success && json.data?.legal) {
        setLegal(json.data.legal);
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
        body: JSON.stringify({ legal }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Legal policies updated successfully!");
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
          <h1 className="text-3xl font-bold tracking-tight">Legal & Policies</h1>
          <p className="text-muted-foreground mt-1">Manage your store's terms, conditions, and customer policies.</p>
        </div>
        <Button onClick={saveSettings} disabled={isSaving} className="gap-2">
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid gap-8">
        
        {/* Fulfillment Policies */}
        <div className="border border-border rounded-xl bg-card overflow-hidden">
          <div className="p-6 border-b border-border flex items-center gap-2 bg-muted/20">
            <Truck className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-lg">Fulfillment Policies</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid gap-3">
              <label className="text-sm font-semibold flex items-center gap-2">
                <Truck className="h-4 w-4 text-muted-foreground" /> Shipping Policy
              </label>
              <Textarea 
                value={legal.shippingPolicy || ""} 
                onChange={(e) => setLegal({...legal, shippingPolicy: e.target.value})} 
                placeholder="Detail your shipping methods, delivery times, and costs here..."
                rows={6}
                className="resize-y"
              />
            </div>
            
            <div className="grid gap-3 pt-4 border-t border-border/50">
              <label className="text-sm font-semibold flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-muted-foreground" /> Return & Refund Policy
              </label>
              <Textarea 
                value={legal.returnPolicy || ""} 
                onChange={(e) => setLegal({...legal, returnPolicy: e.target.value})} 
                placeholder="Explain your conditions for returns, time limits, and refund processing..."
                rows={6}
                className="resize-y"
              />
            </div>
          </div>
        </div>

        {/* Legal Agreements */}
        <div className="border border-border rounded-xl bg-card overflow-hidden">
          <div className="p-6 border-b border-border flex items-center gap-2 bg-muted/20">
            <ShieldAlert className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-lg">Legal Agreements</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid gap-3">
              <label className="text-sm font-semibold flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" /> Privacy Policy
              </label>
              <Textarea 
                value={legal.privacyPolicy || ""} 
                onChange={(e) => setLegal({...legal, privacyPolicy: e.target.value})} 
                placeholder="Describe how you collect, use, and protect customer data..."
                rows={8}
                className="resize-y font-mono text-sm"
              />
            </div>
            
            <div className="grid gap-3 pt-4 border-t border-border/50">
              <label className="text-sm font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" /> Terms of Service
              </label>
              <Textarea 
                value={legal.termsOfService || ""} 
                onChange={(e) => setLegal({...legal, termsOfService: e.target.value})} 
                placeholder="Your general terms and conditions of sale..."
                rows={8}
                className="resize-y font-mono text-sm"
              />
            </div>
          </div>
        </div>

        {/* Checkout Settings */}
        <div className="border border-border rounded-xl bg-card overflow-hidden">
          <div className="p-6 border-b border-border flex items-center gap-2 bg-muted/20">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-lg">Checkout Notice</h2>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground">This text will be displayed prominently on the checkout page before the customer confirms their order.</p>
            <div className="grid gap-2">
              <Textarea 
                value={legal.checkoutNotice || ""} 
                onChange={(e) => setLegal({...legal, checkoutNotice: e.target.value})} 
                placeholder="e.g., By completing this order, you agree to our Terms of Service and Privacy Policy."
                rows={3}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
