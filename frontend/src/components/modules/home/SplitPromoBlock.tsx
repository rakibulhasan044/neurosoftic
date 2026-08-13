import Image from "next/image";
import { Button } from "@/components/ui/button";

interface SplitPromoBlockProps {
  promoBanner?: any;
}

export function SplitPromoBlock({ promoBanner }: SplitPromoBlockProps) {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="rounded-3xl overflow-hidden bg-card border border-border/50 grid grid-cols-1 lg:grid-cols-2 shadow-sm">
          <div className="p-10 md:p-16 flex flex-col justify-center">
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 w-max">
              Limited Time Offer
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              {promoBanner?.title || "Elevate Your Workspace"}
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Transform your desk into a powerhouse of productivity with our new minimalist mechanical keyboards and precision mice.
            </p>
            <Button size="lg" className="w-max rounded-full px-8">Shop the Collection</Button>
          </div>
          <div className="relative h-64 lg:h-auto bg-primary/5 min-h-[400px]">
            {promoBanner?.imageUrl ? (
              <Image src={promoBanner.imageUrl} alt={promoBanner.title} fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                Workspace Lifestyle Image
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
