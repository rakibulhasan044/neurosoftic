import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/FadeIn";

export async function Testimonials() {
  let reviews = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/reviews?limit=4`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      reviews = data.data || [];
    }
  } catch (error) {}

  if (reviews.length === 0) {
    return (
      <section className="py-20 bg-muted/10 text-center">
        <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
        <p className="text-muted-foreground">No reviews available at the moment.</p>
      </section>
    );
  }
  return (
    <section className="py-20 bg-muted/10">
      <div className="container mx-auto px-4">
        <FadeIn direction="up">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">What Our Customers Say</h2>
            <p className="text-muted-foreground">Don't just take our word for it. Read verified reviews from our community.</p>
          </div>
        </FadeIn>
        
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.slice(0, 4).map((review: any, i: number) => (
            <StaggerItem key={review.id || i}>
              <Card className="bg-background border-border/50 shadow-sm hover:shadow-md transition-shadow h-full">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(review.rating || 5)].map((_, idx) => (
                      <Star key={idx} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-lg italic mb-6 text-foreground/90">"{review.text || review.comment}"</p>
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                      {(review.name || review.user?.name || "U").charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{review.name || review.user?.name || "Anonymous"}</h4>
                      <span className="text-xs text-muted-foreground">Verified Buyer</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
