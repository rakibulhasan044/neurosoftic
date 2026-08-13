export async function BrandStrip() {
  let brands = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/brands`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      brands = data.data || [];
    }
  } catch (error) {}

  if (brands.length === 0) {
    return null;
  }
  return (
    <section className="py-10 border-y border-border/50 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm font-medium text-muted-foreground mb-6 uppercase tracking-wider">Trusted by top brands</p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
          {brands.map((brand: any, i: number) => (
            <div key={brand.id || i} className="flex items-center justify-center grayscale hover:grayscale-0 transition-all cursor-pointer">
              {brand.logo ? (
                <img src={brand.logo} alt={brand.name} className="h-8 md:h-12 object-contain" />
              ) : (
                <div className="text-xl md:text-3xl font-extrabold tracking-tighter text-foreground/80">
                  {brand.name}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
