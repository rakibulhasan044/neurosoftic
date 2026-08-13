import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export function BestSellers() {
  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">Best Sellers</h2>
          <p className="text-muted-foreground">Our most popular products, loved by thousands of customers worldwide.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="group overflow-hidden border-transparent shadow-sm hover:shadow-md transition-all duration-300">
              <div className="aspect-[4/5] relative overflow-hidden bg-secondary/30">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  Product Image
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center">
                  <Button className="w-full bg-white text-black hover:bg-gray-200">Quick View</Button>
                </div>
              </div>
              <CardContent className="p-5 text-center">
                <div className="flex justify-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <h3 className="font-medium text-lg mb-1 truncate">Flagship Model {i}</h3>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-bold text-lg">${199 + i * 100}.00</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
