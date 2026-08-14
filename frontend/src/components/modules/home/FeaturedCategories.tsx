import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/FadeIn";

export async function FeaturedCategories() {
  let categories = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/categories`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      categories = data.data || [];
    }
  } catch (error) {}

  if (categories.length === 0) {
    return (
      <section className="py-20 bg-background text-center">
        <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
        <p className="text-muted-foreground">No categories available at the moment.</p>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <FadeIn direction="up">
          <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">Shop by Category</h2>
              <p className="text-muted-foreground">Explore our wide range of premium products.</p>
            </div>
            <Link href="/products" className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors group">
              Browse All <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </FadeIn>
        
        <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {categories.map((category: any, index: number) => (
            <StaggerItem key={category.id || index}>
              <Link href={`/products?category=${category.slug}`}>
                <div className="group rounded-2xl border border-border/50 bg-card p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300 flex flex-col items-center text-center cursor-pointer">
                  <div className="p-4 rounded-full mb-4 transition-transform duration-300 group-hover:scale-110 bg-primary/10 text-primary">
                    {category.image ? (
                      <img src={category.image} alt={category.name} className="h-12 w-12 object-contain" />
                    ) : (
                      <Tag className="h-8 w-8" />
                    )}
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category._count?.products || 0} Products</p>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
