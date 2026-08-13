"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Menu, Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";

export default function NavigationSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [navigation, setNavigation] = useState<any[]>([]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/store-settings`);
      const json = await res.json();
      if (json.success) {
        setNavigation(json.data?.navigation || []);
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
        body: JSON.stringify({ navigation }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Navigation updated successfully!");
        setNavigation(json.data.navigation || []);
      } else {
        toast.error("Failed to update settings");
      }
    } catch (err) {
      toast.error("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  // Very simplified menu builder logic for the scope of this view
  const addMenu = () => {
    setNavigation([...navigation, { name: "New Menu", position: "HEADER", isActive: true, items: [] }]);
  };

  const removeMenu = (index: number) => {
    setNavigation(navigation.filter((_, i) => i !== index));
  };

  const updateMenu = (index: number, field: string, value: any) => {
    const newNav = [...navigation];
    newNav[index][field] = value;
    setNavigation(newNav);
  };

  const addMenuItem = (menuIndex: number) => {
    const newNav = [...navigation];
    const items = newNav[menuIndex].items || [];
    items.push({ label: "New Link", url: "/" });
    newNav[menuIndex].items = items;
    setNavigation(newNav);
  };

  const updateMenuItem = (menuIndex: number, itemIndex: number, field: string, value: any) => {
    const newNav = [...navigation];
    newNav[menuIndex].items[itemIndex][field] = value;
    setNavigation(newNav);
  };

  const removeMenuItem = (menuIndex: number, itemIndex: number) => {
    const newNav = [...navigation];
    newNav[menuIndex].items.splice(itemIndex, 1);
    setNavigation(newNav);
  };

  if (isLoading) return <div className="p-8">Loading settings...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Navigation</h1>
          <p className="text-muted-foreground mt-1">Manage header and footer menus.</p>
        </div>
        <Button onClick={saveSettings} disabled={isSaving} className="gap-2">
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Menu className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-lg">Menu Groups</h2>
          </div>
          <Button onClick={addMenu} size="sm" variant="outline" className="gap-2">
            <Plus className="h-4 w-4" /> Add Menu Group
          </Button>
        </div>
        
        <div className="p-6 space-y-8">
          {navigation.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No menus configured.
            </div>
          ) : (
            navigation.map((menu, mIndex) => (
              <div key={mIndex} className="border border-border/60 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-muted/30 p-4 border-b border-border/60 flex items-center gap-4">
                  <Input 
                    value={menu.name} 
                    onChange={(e) => updateMenu(mIndex, "name", e.target.value)}
                    className="max-w-[250px] font-semibold bg-background"
                  />
                  <select 
                    className="flex h-9 w-[180px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={menu.position}
                    onChange={(e) => updateMenu(mIndex, "position", e.target.value)}
                  >
                    <option value="HEADER">Main Header</option>
                    <option value="FOOTER_1">Footer Column 1</option>
                    <option value="FOOTER_2">Footer Column 2</option>
                    <option value="FOOTER_3">Footer Column 3</option>
                    <option value="MOBILE">Mobile Menu</option>
                  </select>
                  
                  <div className="ml-auto flex items-center gap-4">
                    <label className="text-sm flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={menu.isActive !== false} 
                        onChange={(e) => updateMenu(mIndex, "isActive", e.target.checked)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      Active
                    </label>
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => removeMenu(mIndex)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 bg-background">
                  <div className="space-y-3 mb-4">
                    {(menu.items || []).map((item: any, iIndex: number) => (
                      <div key={iIndex} className="flex items-center gap-3 bg-muted/20 p-2 rounded-md border border-border/30 group">
                        <div className="flex flex-col gap-1 text-muted-foreground">
                          <ChevronUp className="h-3 w-3 cursor-pointer hover:text-foreground" />
                          <ChevronDown className="h-3 w-3 cursor-pointer hover:text-foreground" />
                        </div>
                        <Input 
                          placeholder="Label (e.g. Shop)" 
                          value={item.label}
                          onChange={(e) => updateMenuItem(mIndex, iIndex, "label", e.target.value)}
                          className="max-w-[200px]"
                        />
                        <Input 
                          placeholder="URL (e.g. /products)" 
                          value={item.url}
                          onChange={(e) => updateMenuItem(mIndex, iIndex, "url", e.target.value)}
                        />
                        <Button variant="ghost" size="icon" className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeMenuItem(mIndex, iIndex)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {(menu.items || []).length === 0 && (
                      <div className="text-sm text-muted-foreground py-2 text-center">No links added to this menu yet.</div>
                    )}
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => addMenuItem(mIndex)} className="w-full border-dashed">
                    <Plus className="h-4 w-4 mr-2" /> Add Link
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
