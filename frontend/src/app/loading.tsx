"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function GlobalLoading() {
  const [show, setShow] = useState(false);

  // Small delay to prevent flashing loading screen on fast navigations
  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="flex h-[70vh] w-full flex-col items-center justify-center space-y-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <h2 className="text-xl font-semibold tracking-tight text-foreground">Loading...</h2>
      <p className="text-sm text-muted-foreground text-center max-w-sm">
        Please wait while we prepare this page for you.
      </p>
    </div>
  );
}
