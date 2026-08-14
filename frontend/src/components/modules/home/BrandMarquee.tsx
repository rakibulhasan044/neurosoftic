/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Marquee from "react-fast-marquee";

export function BrandMarquee({ brands }: { brands: any[] }) {
  return (
    <div className="opacity-90">
      <Marquee speed={70} gradient={false} pauseOnHover={true}>
        {brands.map((brand: any, i: number) => (
          <div
            key={brand.id || i}
            className="mx-4 md:mx-8 w-32 md:w-40 h-28 md:h-32 bg-white rounded-lg flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            {/* Logo */}
            {brand.logo && (
              <img
                src={brand.logo}
                alt={brand.name || "Brand"}
                className="h-10 md:h-14 w-20 md:w-24 object-contain"
              />
            )}

            {/* Name */}
            {brand.name && (
              <div className="text-sm md:text-base font-semibold text-gray-700 text-center">
                {brand.name}
              </div>
            )}
          </div>
        ))}
      </Marquee>
    </div>
  );
}
