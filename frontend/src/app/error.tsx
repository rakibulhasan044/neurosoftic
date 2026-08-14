"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4">
      <div className="rounded-full bg-destructive/10 p-6 mb-6">
        <AlertTriangle className="h-16 w-16 text-destructive" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
        Something went wrong
      </h1>
      <p className="text-lg text-muted-foreground max-w-lg mb-8">
        We apologize for the inconvenience. An unexpected error has occurred while trying to load this page.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          size="lg" 
          onClick={() => reset()} 
          className="h-12 px-8 rounded-full"
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
        <Button asChild size="lg" variant="outline" className="h-12 px-8 rounded-full">
          <Link href="/">
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
