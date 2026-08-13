import { Button } from "@/components/ui/button";

export function EditorialStory() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Designed for the Modern Creative</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We believe that technology should seamlessly integrate into your life, enhancing your creativity without getting in the way. Every product we curate is selected for its exceptional design, unparalleled performance, and lasting durability.
          </p>
          <div className="pt-4">
            <Button variant="outline" size="lg" className="rounded-full px-8">Read Our Story</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
