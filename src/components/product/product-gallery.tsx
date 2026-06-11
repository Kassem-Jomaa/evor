"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/utils/cn";

/**
 * Product image gallery (Task 4.4): a large main image with selectable
 * thumbnails. Falls back gracefully to a single image when only one is given.
 */
export function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  const mainSrc = images[active] ?? images[0];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted">
        <AnimatePresence mode="popLayout" initial={false}>
          {mainSrc && (
            <motion.div
              key={mainSrc}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={mainSrc}
                alt={alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`View image ${index + 1}`}
              aria-current={index === active}
              className={cn(
                "relative aspect-square overflow-hidden rounded-md border bg-muted transition-colors",
                index === active
                  ? "border-brand ring-2 ring-brand/30"
                  : "border-border hover:border-brand/50",
              )}
            >
              <Image
                src={src}
                alt={`${alt} thumbnail ${index + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
