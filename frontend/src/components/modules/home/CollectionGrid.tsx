import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CollectionGrid() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto md:h-[600px]">
          {/* Large Left Collection */}
          <div className="relative rounded-2xl overflow-hidden group h-[400px] md:h-full">
            <div className="absolute inset-0 bg-muted flex items-center justify-center text-muted-foreground transition-transform duration-700 group-hover:scale-105">
              Lifestyle Image 1
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <h3 className="text-3xl font-bold text-white mb-3">Work from Anywhere</h3>
              <p className="text-white/80 mb-6 max-w-sm">Premium accessories for the modern digital nomad.</p>
              <Link href="/collections/nomad" className="inline-flex items-center text-white font-medium hover:underline">
                Explore Collection <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
          
          {/* Right Two Collections Stacked */}
          <div className="flex flex-col gap-6 h-[800px] md:h-full">
            <div className="relative rounded-2xl overflow-hidden group flex-1">
              <div className="absolute inset-0 bg-secondary/50 flex items-center justify-center text-muted-foreground transition-transform duration-700 group-hover:scale-105">
                Lifestyle Image 2
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <h3 className="text-2xl font-bold text-white mb-2">Audiophile Grade</h3>
                <Link href="/collections/audio" className="inline-flex items-center text-white font-medium hover:underline">
                  Shop Audio <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden group flex-1">
              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center text-muted-foreground transition-transform duration-700 group-hover:scale-105">
                Lifestyle Image 3
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <h3 className="text-2xl font-bold text-white mb-2">Smart Home Setup</h3>
                <Link href="/collections/smart-home" className="inline-flex items-center text-white font-medium hover:underline">
                  Shop Smart Home <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
