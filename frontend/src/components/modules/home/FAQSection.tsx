import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export async function FAQSection() {
  let faqs = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/v1'}/store-settings`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      faqs = data.data?.faq || [];
    }
  } catch (error) {}

  if (!faqs || faqs.length === 0) {
    faqs = [
      { q: "What is your return policy?", a: "We offer a 30-day hassle-free return policy. If you are not completely satisfied with your purchase, you can return it within 30 days for a full refund." },
      { q: "Do you offer international shipping?", a: "Yes, we ship to over 50 countries worldwide. Shipping costs and delivery times vary depending on the destination." },
      { q: "How long does the warranty last?", a: "All our premium electronics come with a standard 2-year warranty covering manufacturing defects. Extended warranties are available at checkout." },
      { q: "Can I track my order?", a: "Absolutely. Once your order is dispatched, you will receive a tracking link via email to monitor your delivery in real-time." },
    ];
  }

  return (
    <section className="py-20 bg-muted/10">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">Everything you need to know about our products and services.</p>
        </div>
        
        <Accordion className="w-full bg-background rounded-2xl p-6 shadow-sm border border-border/50">
          {faqs.map((faq: any, i: number) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-semibold text-lg hover:text-primary transition-colors">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
