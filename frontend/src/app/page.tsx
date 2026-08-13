import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, Truck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-banner.jpg"
            alt="Premium Wireless Headphones"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Subtle gradient overlay for text readability and premium feel */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-start">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 drop-shadow-md">
              Experience Sound in <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Pure Fidelity</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-lg">
              Discover the AETHER Pro. Next-generation active noise cancellation with studio-quality acoustics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-black hover:bg-gray-200 font-semibold px-8 h-12 rounded-full">
                Shop Now
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 hover:text-white font-semibold px-8 h-12 rounded-full backdrop-blur-sm">
                Explore Features
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-b border-border/50 bg-background/50 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="p-3 rounded-full bg-primary/10 text-primary mb-2">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground">Free Express Delivery</h3>
              <p className="text-sm text-muted-foreground">On all orders over $200</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="p-3 rounded-full bg-primary/10 text-primary mb-2">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground">2-Year Warranty</h3>
              <p className="text-sm text-muted-foreground">Premium protection included</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="p-3 rounded-full bg-primary/10 text-primary mb-2">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground">Secure Checkout</h3>
              <p className="text-sm text-muted-foreground">Encrypted payment processing</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">Featured Products</h2>
              <p className="text-muted-foreground">Handpicked premium tech for you.</p>
            </div>
            <Link href="/products" className="hidden sm:flex items-center text-primary hover:text-primary/80 font-medium transition-colors">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="group overflow-hidden border-border/50 bg-card hover:border-primary/50 transition-colors duration-300">
                <div className="aspect-square relative overflow-hidden bg-muted">
                  {/* Placeholder for product images */}
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-secondary/20 group-hover:scale-105 transition-transform duration-500">
                    Product Image {i}
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-lg mb-1 truncate group-hover:text-primary transition-colors">Premium Device {i}</h3>
                  <p className="text-sm text-muted-foreground mb-3">High-end electronics</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg">${299 + i * 50}.00</span>
                    <Button variant="secondary" size="sm" className="rounded-full">Add</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-10 flex justify-center sm:hidden">
            <Button variant="outline" className="w-full">View All Products</Button>
          </div>
        </div>
      </section>

      {/* Promotional Split Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="rounded-3xl overflow-hidden bg-card border border-border/50 grid grid-cols-1 lg:grid-cols-2 shadow-sm">
            <div className="p-10 md:p-16 flex flex-col justify-center">
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 w-max">
                Limited Time Offer
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">Elevate Your Workspace</h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Transform your desk into a powerhouse of productivity with our new minimalist mechanical keyboards and precision mice.
              </p>
              <Button size="lg" className="w-max rounded-full px-8">Shop the Collection</Button>
            </div>
            <div className="relative h-64 lg:h-auto bg-primary/5">
               {/* Placeholder for promotional image */}
               <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  Workspace Lifestyle Image
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
