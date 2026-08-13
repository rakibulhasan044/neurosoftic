/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnnouncementBar } from "@/components/modules/home/AnnouncementBar";
import { HeroSlider } from "@/components/modules/home/HeroSlider";
import { FeaturedCategories } from "@/components/modules/home/FeaturedCategories";
import { LatestCollection } from "@/components/modules/home/LatestCollection";
import { BestSellers } from "@/components/modules/home/BestSellers";
import { PromotionalBanner } from "@/components/modules/home/PromotionalBanner";
import { CollectionGrid } from "@/components/modules/home/CollectionGrid";
import { SplitPromoBlock } from "@/components/modules/home/SplitPromoBlock";
import { BrandStrip } from "@/components/modules/home/BrandStrip";
import { EditorialStory } from "@/components/modules/home/EditorialStory";
import { TrustUSP } from "@/components/modules/home/TrustUSP";
import { Testimonials } from "@/components/modules/home/Testimonials";
import { SocialFeed } from "@/components/modules/home/SocialFeed";
import { Newsletter } from "@/components/modules/home/Newsletter";
import { FAQSection } from "@/components/modules/home/FAQSection";

async function getStoreBanners() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/store-settings`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      return data.data?.banners || [];
    }
  } catch (err) {
    console.error("Failed to fetch store settings", err);
  }
  return [];
}

export default async function Home() {
  const banners = await getStoreBanners();
  const heroBanner = banners.find((b: any) => b.position === "HERO" && b.isActive);
  const promoBanner = banners.find((b: any) => b.position === "PROMO" && b.isActive);

  return (
    <div className="flex flex-col min-h-screen">
      <AnnouncementBar />
      <HeroSlider heroBanner={heroBanner} />
      <FeaturedCategories />
      <LatestCollection />
      <PromotionalBanner />
      <CollectionGrid />
      <BestSellers />
      <SplitPromoBlock promoBanner={promoBanner} />
      <BrandStrip />
      <EditorialStory />
      <TrustUSP />
      <Testimonials />
      <SocialFeed />
      <FAQSection />
      <Newsletter />
    </div>
  );
}
