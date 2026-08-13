"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ChangePasswordContent() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/auth/change-password`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Password changed successfully!");
        const role = localStorage.getItem("userRole");
        if (role === "SUPER_ADMIN" || role === "ADMIN") {
          router.push("/dashboard/admin");
        } else {
          router.push("/dashboard/customer");
        }
      } else {
        toast.error(data.message || "Failed to change password");
      }
    } catch (err: any) {
      toast.error("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container relative min-h-[calc(100vh-16rem)] flex-col items-center justify-center flex mx-auto px-4">
      <Card className="w-full max-w-md border-border/50 shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Change Password</CardTitle>
          <CardDescription>
            You are required to set a new password before continuing.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">New Password</label>
              <Input 
                type="password" 
                required 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Confirm New Password</label>
              <Input 
                type="password" 
                required 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full mt-4 h-11" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
