"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import type { HeroContent } from "@/types";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Staggered entrance for the hero copy. */
const item = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: EASE },
});

/**
 * Hero banner (Tasks 3.1, 11.1). Content comes from the CMS (`GET /cms`), so
 * the image, title, subtitle and CTA are all admin-editable. The image settles
 * with a slow Ken-Burns zoom while the copy cascades in.
 */
export function HeroBanner({ content }: { content: HeroContent }) {
  return (
    <section className="relative isolate flex min-h-[72vh] items-center overflow-hidden border-b border-border sm:min-h-[82vh]">
      {/* Banner image with a slow settle-in zoom */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease: EASE }}
      >
        <Image
          src={content.image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/85 to-background/25" />

      <Container className="relative py-24 sm:py-32">
        <div className="max-w-xl">
          <motion.p
            {...item(0.1)}
            className="mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand"
          >
            <span className="h-px w-8 bg-brand" aria-hidden />
            The EVOR Collection
          </motion.p>

          <motion.h1
            {...item(0.25)}
            className="font-serif text-4xl font-bold leading-[1.08] tracking-tight text-balance sm:text-6xl lg:text-7xl"
          >
            {content.title}
          </motion.h1>

          <motion.p
            {...item(0.45)}
            className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {content.subtitle}
          </motion.p>

          <motion.div {...item(0.6)} className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg" className="group h-12 rounded-full px-8">
              <Link href={content.ctaHref}>
                {content.ctaLabel}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-full px-8"
            >
              <Link href="/shop">Browse all bags</Link>
            </Button>
          </motion.div>

          <motion.p
            {...item(0.8)}
            className="mt-12 text-xs uppercase tracking-[0.2em] text-muted-foreground"
          >
            Handcrafted leather · Cash on delivery · Free shipping over $100
          </motion.p>
        </div>
      </Container>
    </section>
  );
}
