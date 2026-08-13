import type { Metadata, ResolvingMetadata } from "next";
import { Inter, Roboto, Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartProvider } from "@/context/cart-context";
import { Toaster } from "@/components/ui/sonner";

// Pre-load common fonts so they can be switched dynamically
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const roboto = Roboto({ weight: ["400", "500", "700"], subsets: ["latin"], variable: "--font-roboto" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export async function generateMetadata(
  { params }: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const settings = await getStoreSettings();
  const seo = settings?.seo || {};
  const identity = settings?.identity || {};
  
  return {
    title: seo.title || identity.companyName || "Neurosoftic | Premium Tech & Lifestyle",
    description: seo.description || "Elevate your everyday experience with premium tech products.",
    keywords: seo.keywords || "premium electronics, audio, smart home",
    openGraph: seo.ogImage ? {
      images: [seo.ogImage],
    } : undefined,
    icons: {
      icon: settings?.theme?.faviconUrl || "/favicon.ico",
      apple: settings?.theme?.appIconUrl || "/apple-touch-icon.png",
    }
  };
}

async function getStoreSettings() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/store-settings`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (err) {
    console.error("Failed to fetch store settings", err);
  }
  return null;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body 
        className={`${inter.className} min-h-screen bg-background text-foreground antialiased flex flex-col`}
      >
        <CartProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
