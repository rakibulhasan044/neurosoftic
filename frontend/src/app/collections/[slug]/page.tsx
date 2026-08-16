import { Metadata } from "next";
import Image from "next/image";
import { ProductCard } from "@/components/modules/products/ProductCard";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/FadeIn";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const p = await params;
  return {
    title: `Collection | Neurosoftic`,
    description: "Browse our curated collection of premium products.",
  };
}

async function getCollection(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/collections/${slug}`, { 
      cache: 'no-store'
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch');
    }
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error("Error fetching collection:", error);
    return null;
  }
}

export default async function CollectionPage({ params }: any) {
  const { slug } = await params;
  const collection = await getCollection(slug);

  if (!collection) {
    notFound();
  }

  const products = collection.products || [];

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      {/* Collection Banner */}
      <div className="relative h-[40vh] md:h-[50vh] w-full bg-black overflow-hidden flex items-center justify-center">
        {collection.banner ? (
          <Image 
            src={collection.banner} 
            alt={collection.name} 
            fill 
            className="object-cover opacity-60"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-purple-800/80" />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-10">
          <FadeIn direction="up">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4 drop-shadow-md">
              {collection.name}
            </h1>
            {collection.description && (
              <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
                {collection.description}
              </p>
            )}
          </FadeIn>
        </div>

        {/* Breadcrumb Back */}
        <div className="absolute top-6 left-6 z-20">
          <Link href="/" className="inline-flex items-center text-white/80 hover:text-white font-medium bg-black/20 hover:bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm transition-all text-sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Home
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">
            {products.length} {products.length === 1 ? 'Product' : 'Products'}
          </h2>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-background rounded-2xl border border-border/50">
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-6">There are currently no products in this collection.</p>
            <Link href="/products" className="text-primary hover:underline font-medium">
              Browse all products
            </Link>
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <StaggerItem key={product.id}>
                <ProductCard product={product} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </div>
  );
}
