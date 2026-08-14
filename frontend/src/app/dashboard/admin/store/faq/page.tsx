"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save, Plus, Trash2, GripVertical } from "lucide-react";

type FAQ = {
  q: string;
  a: string;
};

export default function FAQSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/store-settings`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }});
      if (res.ok) {
        const data = await res.json();
        if (data.data?.faq && Array.isArray(data.data.faq)) {
          setFaqs(data.data.faq);
        } else {
          // Default fallbacks if empty
          setFaqs([
            { q: "What is your return policy?", a: "We offer a 30-day hassle-free return policy. If you are not completely satisfied with your purchase, you can return it within 30 days for a full refund." },
            { q: "Do you offer international shipping?", a: "Yes, we ship to over 50 countries worldwide. Shipping costs and delivery times vary depending on the destination." }
          ]);
        }
      }
    } catch (error) {
      toast.error("Failed to load FAQ settings");
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
        body: JSON.stringify({ faq: faqs })
      });
      
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("FAQ settings saved successfully");
      } else {
        toast.error(data.message || "Failed to save settings");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const addFaq = () => {
    setFaqs([...faqs, { q: "", a: "" }]);
  };

  const updateFaq = (index: number, field: 'q' | 'a', value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index][field] = value;
    setFaqs(newFaqs);
  };

  const removeFaq = (index: number) => {
    const newFaqs = faqs.filter((_, i) => i !== index);
    setFaqs(newFaqs);
  };

  const moveFaq = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === faqs.length - 1)
    ) return;

    const newFaqs = [...faqs];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newFaqs[index];
    newFaqs[index] = newFaqs[targetIndex];
    newFaqs[targetIndex] = temp;
    setFaqs(newFaqs);
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">FAQ Configuration</h1>
          <p className="text-muted-foreground">Manage the Frequently Asked Questions displayed on your homepage.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={addFaq}>
            <Plus className="mr-2 h-4 w-4" /> Add Question
          </Button>
          <Button onClick={handleSave} disabled={saving} className="min-w-[120px]">
            {saving ? "Saving..." : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {faqs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No FAQs added yet. Click "Add Question" to create one.
            </CardContent>
          </Card>
        ) : (
          faqs.map((faq, index) => (
            <Card key={index} className="relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-muted border-r border-border flex flex-col items-center justify-center gap-2">
                <button 
                  onClick={() => moveFaq(index, 'up')}
                  disabled={index === 0}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-30 p-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                </button>
                <GripVertical className="h-4 w-4 text-muted-foreground/50" />
                <button 
                  onClick={() => moveFaq(index, 'down')}
                  disabled={index === faqs.length - 1}
                  className="text-muted-foreground hover:text-foreground disabled:opacity-30 p-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </button>
              </div>
              
              <CardContent className="pl-12 pt-6 pb-6 pr-6">
                <div className="flex justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <Input 
                      value={faq.q} 
                      onChange={(e) => updateFaq(index, 'q', e.target.value)} 
                      placeholder="Enter the question (e.g., What is your return policy?)"
                      className="font-medium text-base"
                    />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                    onClick={() => removeFaq(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div>
                  <Textarea 
                    value={faq.a} 
                    onChange={(e) => updateFaq(index, 'a', e.target.value)} 
                    placeholder="Enter the answer..."
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
