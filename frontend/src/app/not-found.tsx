import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion, Home } from "lucide-react";

export default function GlobalNotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4">
      <div className="rounded-full bg-muted p-6 mb-6">
        <FileQuestion className="h-16 w-16 text-muted-foreground" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
        Page Not Found
      </h1>
      <p className="text-lg text-muted-foreground max-w-lg mb-8">
        We couldn't find the page you were looking for. It might have been moved, renamed, or perhaps never existed at all.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg" className="h-12 px-8 rounded-full">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="h-12 px-8 rounded-full">
          <Link href="/products">
            Browse Products
          </Link>
        </Button>
      </div>
    </div>
  );
}
