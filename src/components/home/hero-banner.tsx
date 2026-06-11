import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import type { HeroContent } from "@/types";

/**
 * Hero banner (Task 3.1). Content comes from the CMS (`GET /cms`), so the
 * image, title, subtitle and CTA are all admin-editable.
 */
export function HeroBanner({ content }: { content: HeroContent }) {
  return (
    <section className="relative isolate overflow-hidden border-b border-border">
      {/* Banner image */}
      <Image
        src={content.image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />

      <Container className="relative py-24 sm:py-32 lg:py-40">
        <div className="max-w-xl">
          <h1 className="font-serif text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {content.title}
          </h1>
          <p className="mt-6 max-w-md text-base text-muted-foreground sm:text-lg">
            {content.subtitle}
          </p>
          <div className="mt-10">
            <Button asChild size="lg">
              <Link href={content.ctaHref}>{content.ctaLabel}</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
