import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  return (
    <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Join the Inner Circle</h2>
          <p className="text-primary-foreground/80 text-lg">
            Subscribe to our newsletter for exclusive early access to new product drops, special subscriber-only discounts, and tech insights.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Enter your email address" 
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60 h-12 focus-visible:ring-white"
              required 
            />
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100 h-12 px-8 font-bold">
              Subscribe
            </Button>
          </form>
          <p className="text-xs text-primary-foreground/60 mt-4">
            By subscribing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </section>
  );
}
