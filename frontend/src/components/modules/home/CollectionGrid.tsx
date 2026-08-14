import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/animations/FadeIn";

export async function CollectionGrid() {
  let collections = [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:8000/api/v1"}/collections`,
      { cache: "no-store" },
    );
    if (res.ok) {
      const data = await res.json();
      collections = data.data || [];
    }
  } catch (error) {}

  if (collections.length === 0) {
    return (
      <section className="py-20 bg-background text-center">
        <h2 className="text-3xl font-bold mb-4">Curated Collections</h2>
        <p className="text-muted-foreground">
          No collections available at the moment.
        </p>
      </section>
    );
  }

  const firstCollection = collections[0];
  const rightCollections = collections.slice(1, 3);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto md:h-[600px]">
          {/* Large Left Collection */}
          {firstCollection && (
            <StaggerItem className="h-full">
              <div className="relative rounded-2xl overflow-hidden group h-[400px] md:h-full">
                {firstCollection.banner ? (
                  <img
                    src={firstCollection.banner}
                    alt={firstCollection.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-muted flex items-center justify-center text-muted-foreground transition-transform duration-700 group-hover:scale-105">
                    No Image
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <h3 className="text-3xl font-bold text-white mb-3">
                    {firstCollection.name}
                  </h3>
                  <p className="text-white/80 mb-6 max-w-sm">
                    {firstCollection.description ||
                      "Discover our curated selection."}
                  </p>
                  <Link
                    href={`/collections/${firstCollection.slug}`}
                    className="inline-flex items-center text-white font-medium hover:underline"
                  >
                    Explore Collection <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </StaggerItem>
          )}

          {/* Right Two Collections Stacked */}
          {rightCollections.length > 0 && (
            <div className="flex flex-col gap-6 h-[800px] md:h-full">
              {rightCollections.map((col: any) => (
                <StaggerItem key={col.id} className="flex-1">
                  <div className="relative rounded-2xl overflow-hidden group h-full w-full">
                    {col.banner ? (
                      <img
                        src={col.banner}
                        alt={col.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-secondary/50 flex items-center justify-center text-muted-foreground transition-transform duration-700 group-hover:scale-105">
                        No Image
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6 sm:p-8 w-full">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {col.name}
                      </h3>
                      <Link
                        href={`/collections/${col.slug}`}
                        className="inline-flex items-center text-white/90 font-medium hover:text-white hover:underline"
                      >
                        Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </div>
          )}
        </StaggerContainer>
      </div>
    </section>
  );
}
