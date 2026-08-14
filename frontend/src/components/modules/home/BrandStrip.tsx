import { BrandMarquee } from "./BrandMarquee";

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
        <BrandMarquee brands={brands} />
      </div>
    </section>
  );
}
