"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function AuthPageContent() {
  const router = useRouter();
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/");
    }
  }, [router]);
  
  // Login State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Register State
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        toast.success("Login successful!");
        if (data.data?.token) {
          localStorage.setItem("token", data.data.token);
          if (data.data.user?.name) {
            localStorage.setItem("userName", data.data.user.name);
            localStorage.setItem("userRole", data.data.user.role);
          }
          window.dispatchEvent(new Event("auth-change"));
        }
        
        if (data.data.user?.forcePasswordChange) {
          toast("Action Required", { description: "You must change your password before continuing." });
          router.push("/change-password");
        } else {
          router.push("/");
        }
      } else {
        toast.error(data.message || "Failed to login");
      }
    } catch (err: any) {
      toast.error("An error occurred during login.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: registerName, email: registerEmail, password: registerPassword }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Account created successfully! Please login.");
        // Switch to login tab
        const loginTrigger = document.querySelector('[value="login"]') as HTMLElement;
        if (loginTrigger) loginTrigger.click();
      } else {
        toast.error(data.message || "Failed to register");
      }
    } catch (err: any) {
      toast.error("An error occurred during registration.");
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="container mx-auto relative flex min-h-[calc(100vh-16rem)] flex-col items-center justify-center px-4 py-12">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
                  <CardDescription>
                    Enter your email below to login to your account
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="email-login" className="text-sm font-medium leading-none">Email</label>
                      <Input 
                        id="email-login" 
                        type="email" 
                        placeholder="m@example.com" 
                        required 
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label htmlFor="password-login" className="text-sm font-medium leading-none">Password</label>
                        <Link href="#" className="text-sm text-primary hover:underline">Forgot password?</Link>
                      </div>
                      <Input 
                        id="password-login" 
                        type="password" 
                        required 
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                      />
                    </div>
                    <Button type="submit" className="w-full mt-4 h-11" disabled={loginLoading}>
                      {loginLoading ? "Logging in..." : "Login"}
                    </Button>
                  </CardContent>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                  <CardDescription>
                    Enter your details below to create your account
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleRegister}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="name-register" className="text-sm font-medium leading-none">Full Name</label>
                      <Input 
                        id="name-register" 
                        placeholder="John Doe" 
                        required 
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email-register" className="text-sm font-medium leading-none">Email</label>
                      <Input 
                        id="email-register" 
                        type="email" 
                        placeholder="m@example.com" 
                        required 
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="password-register" className="text-sm font-medium leading-none">Password</label>
                      <Input 
                        id="password-register" 
                        type="password" 
                        required 
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                      />
                    </div>
                    <Button type="submit" className="w-full mt-4 h-11" disabled={registerLoading}>
                      {registerLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </CardContent>
                </form>
                <CardFooter>
                  <p className="px-8 text-center text-sm text-muted-foreground w-full">
                    By clicking create account, you agree to our{" "}
                    <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
      </div>
    </div>
  );
}
