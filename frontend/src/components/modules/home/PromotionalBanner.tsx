import { Button } from "@/components/ui/button";

export function PromotionalBanner() {
  return (
    <section className="py-12 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">End of Season Sale</h2>
          <p className="text-primary-foreground/80 text-lg">Up to 40% off on selected premium electronics. Limited time only.</p>
        </div>
        <div className="flex-shrink-0">
          <Button size="lg" variant="secondary" className="font-bold rounded-full px-8 bg-white text-black hover:bg-gray-200">
            Shop the Sale
          </Button>
        </div>
      </div>
    </section>
  );
}
