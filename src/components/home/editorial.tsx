import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Gem, HandHeart, Leaf } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

const VALUES = [
  {
    icon: HandHeart,
    title: "Handcrafted",
    text: "Each bag is cut, stitched and finished by hand in small batches.",
  },
  {
    icon: Gem,
    title: "Premium materials",
    text: "Full-grain leather, lined interiors and solid brass hardware.",
  },
  {
    icon: Leaf,
    title: "Made to last",
    text: "Designed to age beautifully — not to be replaced next season.",
  },
];

/** Editorial brand section: craftsmanship story beside a campaign image. */
export function Editorial() {
  return (
    <section className="overflow-hidden border-t border-border py-16 sm:py-24">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <Image
                src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1000&auto=format&fit=crop"
                alt="Woman carrying an EVOR handbag"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            {/* Floating accent card */}
            <div className="absolute -bottom-5 -right-3 rounded-xl border border-border bg-card px-5 py-4 shadow-lg sm:-right-6">
              <p className="font-serif text-2xl font-bold text-brand">5,000+</p>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Happy customers
              </p>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand">
                <span className="h-px w-8 bg-brand" aria-hidden />
                Our craft
              </p>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                Carried by hand, crafted by heart
              </h2>
              <p className="mt-4 max-w-md text-muted-foreground">
                Every EVOR bag begins as a single hide and a sketch. We obsess
                over the details you feel every day — the weight of the strap,
                the glide of the zip, the pocket exactly where you need it.
              </p>
            </Reveal>

            <div className="mt-8 space-y-5">
              {VALUES.map((value, index) => (
                <Reveal key={value.title} delay={0.1 * index}>
                  <div className="flex gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                      <value.icon className="size-4.5" />
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold">{value.title}</h3>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {value.text}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.3}>
              <Button asChild size="lg" className="group mt-9 rounded-full px-8">
                <Link href="/shop">
                  Discover the collection
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
