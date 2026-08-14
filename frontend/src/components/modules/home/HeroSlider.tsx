"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface HeroSliderProps {
  heroBanner?: any;
}

export function HeroSlider({ heroBanner }: HeroSliderProps) {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <section className="relative h-[60vh] min-h-[500px] w-full overflow-hidden rounded-3xl flex items-center shadow-2xl">
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
        
        <div className="relative z-10 px-8 md:px-16 flex flex-col items-start w-full">
        <motion.div 
          className="max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          {heroBanner?.title ? (
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 drop-shadow-md">
              {heroBanner.title}
            </h1>
          ) : (
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 drop-shadow-md">
              Capture Life in <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Perfect Clarity</span>
            </h1>
          )}
          <motion.p 
            className="text-lg md:text-xl text-gray-200 mb-8 max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            Discover our premium selection of professional cameras, lenses, and all essential accessories for your photography journey.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            <Link href="/products">
              <Button size="lg" className="bg-white text-black hover:bg-gray-200 font-semibold px-8 h-12 rounded-full w-full sm:w-auto">
                Shop Now
              </Button>
            </Link>
          </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
