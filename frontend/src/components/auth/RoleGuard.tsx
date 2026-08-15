"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    // 1. Not logged in -> go to auth page
    if (!token) {
      router.push("/auth");
      return;
    }

    // 2. Logged in, but route requires specific roles
    if (allowedRoles && allowedRoles.length > 0) {
      if (!role || !allowedRoles.includes(role)) {
        // Logged in but unauthorized -> go to home
        router.push("/");
        return;
      }
    }

    // 3. Authorized
    setIsAuthorized(true);
  }, [router, allowedRoles]);

  if (!isAuthorized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background/50 backdrop-blur-sm fixed inset-0 z-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
