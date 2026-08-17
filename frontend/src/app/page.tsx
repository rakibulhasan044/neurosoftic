/* eslint-disable @typescript-eslint/no-explicit-any */
import { Suspense } from "react";
import { AnnouncementBar } from "@/components/modules/home/AnnouncementBar";
import { HeroSlider } from "@/components/modules/home/HeroSlider";
import { FeaturedCategories } from "@/components/modules/home/FeaturedCategories";
import { LatestCollection } from "@/components/modules/home/LatestCollection";
import { BestSellers } from "@/components/modules/home/BestSellers";
import { CollectionGrid } from "@/components/modules/home/CollectionGrid";
import { BrandStrip } from "@/components/modules/home/BrandStrip";
import { TrustUSP } from "@/components/modules/home/TrustUSP";
import { Testimonials } from "@/components/modules/home/Testimonials";
import { FAQSection } from "@/components/modules/home/FAQSection";

async function getStoreBanners() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/store-settings`, { next: { revalidate: 300 } });
    if (res.ok) {
      const data = await res.json();
      return data.data?.banners || [];
    }
  } catch (err) {
    console.error("Failed to fetch store settings", err);
  }
  return [];
}

async function HeroSection() {
  const banners = await getStoreBanners();
  const heroBanner = banners.find((b: any) => b.position === "HERO" && b.isActive);
  return <HeroSlider heroBanner={heroBanner} />;
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <AnnouncementBar />
      <Suspense fallback={<div className="h-[60vh] min-h-[500px] w-full bg-muted animate-pulse rounded-3xl container mx-auto px-4 mt-6" />}>
        <HeroSection />
      </Suspense>
      <Suspense fallback={<div className="h-64 container mx-auto bg-muted animate-pulse rounded-xl mt-10" />}>
        <FeaturedCategories />
      </Suspense>
      <Suspense fallback={<div className="h-64 container mx-auto bg-muted animate-pulse rounded-xl mt-10" />}>
        <LatestCollection />
      </Suspense>
      <Suspense fallback={<div className="h-64 container mx-auto bg-muted animate-pulse rounded-xl mt-10" />}>
        <CollectionGrid />
      </Suspense>
      <Suspense fallback={<div className="h-64 container mx-auto bg-muted animate-pulse rounded-xl mt-10" />}>
        <BestSellers />
      </Suspense>
      <BrandStrip />
      <TrustUSP />
      <Testimonials />
      <FAQSection />
    </div>
  );
}
