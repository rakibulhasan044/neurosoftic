import { Button } from "@/components/ui/button";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export function SocialFeed() {
  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4 text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Follow Us @Neurosoftic</h2>
        <p className="text-muted-foreground mb-6">Tag us to be featured on our feed</p>
        <Button variant="outline" className="rounded-full">
          <InstagramIcon className="mr-2 h-4 w-4" />
           Follow on Instagram
        </Button>
      </div>
      
      {/* Horizontal scrolling or grid of social images */}
      <div className="flex gap-4 overflow-x-auto pb-8 px-4 snap-x no-scrollbar">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="relative min-w-[280px] h-[280px] rounded-2xl overflow-hidden bg-muted flex-shrink-0 snap-center group">
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              Social Image {i}
            </div>
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <InstagramIcon className="text-white h-8 w-8" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
