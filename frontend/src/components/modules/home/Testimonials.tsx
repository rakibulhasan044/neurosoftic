import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export function Testimonials() {
  const reviews = [
    { name: "Alex Johnson", text: "The audio quality is absolutely mind-blowing. These are the best headphones I've ever owned.", rating: 5 },
    { name: "Sarah Williams", text: "Incredible design and battery life. It seamlessly connects to all my devices.", rating: 5 },
    { name: "David Chen", text: "Premium build quality that you can feel immediately. Worth every penny.", rating: 5 }
  ];

  return (
    <section className="py-20 bg-muted/10">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">What Our Customers Say</h2>
          <p className="text-muted-foreground">Don't just take our word for it. Read verified reviews from our community.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <Card key={i} className="bg-background border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(review.rating)].map((_, idx) => (
                    <Star key={idx} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-lg italic mb-6 text-foreground/90">"{review.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{review.name}</h4>
                    <span className="text-xs text-muted-foreground">Verified Buyer</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
