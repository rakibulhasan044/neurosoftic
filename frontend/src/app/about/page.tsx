import { Metadata } from "next";
import Image from "next/image";
import { FadeIn } from "@/components/animations/FadeIn";

export const metadata: Metadata = {
  title: "About Us | Neurosoftic",
  description: "Learn more about our company, our mission, and our vision.",
};

async function getAboutSettings() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/store-settings`, {
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      return data.data || null;
    }
  } catch (error) {
    console.error("Failed to fetch about settings", error);
  }
  return null;
}

export default async function AboutPage() {
  const settings = await getAboutSettings();
  const about = settings?.about;
  const business = settings?.businessProfile;
  const legal = settings?.legal;

  const title = about?.title || "About Neurosoftic";
  const story = about?.story || "We started with a vision to build the future. We believe that technology should empower humanity.";
  const mission = about?.mission || "To deliver premium tech to everyone.";
  const vision = about?.vision || "A world connected by seamless innovation.";
  const heroImage = about?.heroImage;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[40vh] md:h-[60vh] w-full bg-muted flex items-center justify-center overflow-hidden">
        {heroImage ? (
          <Image 
            src={heroImage} 
            alt={title} 
            fill 
            className="object-cover opacity-80"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-purple-800/90" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-10">
          <FadeIn direction="up">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-md">
              {title}
            </h1>
          </FadeIn>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <FadeIn direction="up" delay={0.1}>
            <div className="mb-20">
              <h2 className="text-3xl font-bold mb-6 text-foreground">Our Story</h2>
              <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {story}
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <FadeIn direction="up" delay={0.2}>
              <div className="bg-card p-8 rounded-2xl border border-border/50 shadow-sm h-full hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{mission}</p>
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={0.3}>
              <div className="bg-card p-8 rounded-2xl border border-border/50 shadow-sm h-full hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h20"/><path d="M12 2v20"/><circle cx="12" cy="12" r="10"/></svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{vision}</p>
              </div>
            </FadeIn>
          </div>

          {/* Contact and Policies */}
          <div className="mt-20 pt-16 border-t border-border/50">
            <FadeIn direction="up" delay={0.4}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {/* Contact Info */}
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-foreground">Contact Information</h2>
                  <div className="space-y-4 text-muted-foreground">
                    {business?.email && (
                      <div className="flex items-start gap-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        <div>
                          <p className="font-medium text-foreground">Email</p>
                          <a href={`mailto:${business.email}`} className="hover:text-primary transition-colors">{business.email}</a>
                        </div>
                      </div>
                    )}
                    {business?.phone && (
                      <div className="flex items-start gap-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        <div>
                          <p className="font-medium text-foreground">Phone</p>
                          <a href={`tel:${business.phone}`} className="hover:text-primary transition-colors">{business.phone}</a>
                        </div>
                      </div>
                    )}
                    {business?.address && (
                      <div className="flex items-start gap-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <div>
                          <p className="font-medium text-foreground">Address</p>
                          <address className="not-italic whitespace-pre-wrap">{business.address}</address>
                        </div>
                      </div>
                    )}
                    {(!business?.email && !business?.phone && !business?.address) && (
                      <p>Contact information will be updated soon.</p>
                    )}
                  </div>
                </div>

                {/* Legal Policies */}
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-foreground">Business Policies</h2>
                  <div className="space-y-6 text-muted-foreground">
                    {legal?.refundPolicy && (
                      <div>
                        <h4 className="font-medium text-foreground mb-1">Refund Policy</h4>
                        <p className="text-sm line-clamp-3 leading-relaxed">{legal.refundPolicy}</p>
                      </div>
                    )}
                    {legal?.shippingPolicy && (
                      <div>
                        <h4 className="font-medium text-foreground mb-1">Shipping Policy</h4>
                        <p className="text-sm line-clamp-3 leading-relaxed">{legal.shippingPolicy}</p>
                      </div>
                    )}
                    {(!legal?.refundPolicy && !legal?.shippingPolicy) && (
                      <p>Policy information will be updated soon.</p>
                    )}
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}
