export function BrandStrip() {
  const brands = ["SONY", "APPLE", "SAMSUNG", "BOSE", "LOGITECH", "NINTENDO", "MICROSOFT"];
  
  return (
    <section className="py-10 border-y border-border/50 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm font-medium text-muted-foreground mb-6 uppercase tracking-wider">Trusted by top brands</p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
          {brands.map((brand, i) => (
            <div key={i} className="text-xl md:text-3xl font-extrabold tracking-tighter text-foreground/80 grayscale hover:grayscale-0 transition-all cursor-pointer">
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
