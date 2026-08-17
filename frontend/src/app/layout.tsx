import type { Metadata } from "next";
import { Inter, Roboto, Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";
import { NavigationWrapper } from "@/components/NavigationWrapper";
import { CartProvider } from "@/context/cart-context";
import { WishlistProvider } from "@/context/wishlist-context";
import { Toaster } from "@/components/ui/sonner";

// Pre-load common fonts so they can be switched dynamically
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const roboto = Roboto({ weight: ["400", "500", "700"], subsets: ["latin"], variable: "--font-roboto" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Neurosoftic | Premium Tech & Lifestyle",
  description: "Elevate your everyday experience with premium tech products.",
  keywords: "premium electronics, audio, smart home",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  }
};

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
          <WishlistProvider>
            <NavigationWrapper>
              {children}
            </NavigationWrapper>
            <Toaster richColors position="top-right" />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
