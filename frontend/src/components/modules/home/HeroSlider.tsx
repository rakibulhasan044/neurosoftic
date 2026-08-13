import Image from "next/image";
import { Button } from "@/components/ui/button";

interface HeroSliderProps {
  heroBanner?: any;
}

export function HeroSlider({ heroBanner }: HeroSliderProps) {
  return (
    <section className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <Image
          src={heroBanner?.imageUrl || "/hero-banner.jpg"}
          alt={heroBanner?.title || "Premium Wireless Headphones"}
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      </div>
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-start">
        <div className="max-w-2xl">
          {heroBanner?.title ? (
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 drop-shadow-md">
              {heroBanner.title}
            </h1>
          ) : (
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 drop-shadow-md">
              Experience Sound in <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Pure Fidelity</span>
            </h1>
          )}
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-lg">
            Discover the AETHER Pro. Next-generation active noise cancellation with studio-quality acoustics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-white text-black hover:bg-gray-200 font-semibold px-8 h-12 rounded-full">
              Shop Now
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 hover:text-white font-semibold px-8 h-12 rounded-full backdrop-blur-sm">
              Explore Features
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
