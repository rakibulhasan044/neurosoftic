import { Play } from "lucide-react";

export function VideoSection() {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="relative rounded-3xl overflow-hidden aspect-video bg-muted group cursor-pointer">
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground transition-transform duration-700 group-hover:scale-105">
            Cinematic Product Video Thumbnail
          </div>
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-colors group-hover:bg-black/50">
            <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-transform group-hover:scale-110">
              <Play className="h-8 w-8 ml-1 fill-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
