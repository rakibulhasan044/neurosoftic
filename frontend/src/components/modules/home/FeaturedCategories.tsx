import Link from "next/link";
import { ArrowRight, Smartphone, Laptop, Headphones, Watch } from "lucide-react";

export function FeaturedCategories() {
  const categories = [
    { name: "Audio", icon: Headphones, count: "120+ Products", color: "bg-blue-500/10 text-blue-500" },
    { name: "Smartphones", icon: Smartphone, count: "85+ Products", color: "bg-purple-500/10 text-purple-500" },
    { name: "Laptops", icon: Laptop, count: "45+ Products", color: "bg-green-500/10 text-green-500" },
    { name: "Wearables", icon: Watch, count: "60+ Products", color: "bg-orange-500/10 text-orange-500" },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">Shop by Category</h2>
            <p className="text-muted-foreground">Explore our wide range of premium electronics.</p>
          </div>
          <Link href="/categories" className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors group">
            Browse All Categories <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Link key={index} href={`/categories/${category.name.toLowerCase()}`}>
                <div className="group rounded-2xl border border-border/50 bg-card p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300 flex flex-col items-center text-center cursor-pointer">
                  <div className={`p-4 rounded-full mb-4 transition-transform duration-300 group-hover:scale-110 ${category.color}`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
