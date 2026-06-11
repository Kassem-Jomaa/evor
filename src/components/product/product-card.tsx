"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { formatCurrency } from "@/utils/format";
import type { Product } from "@/types";

/**
 * Product card (Task 3.3): image, title, price and a working Add to Cart
 * button wired to the global cart store. Lifts on hover and crossfades to the
 * second gallery image when one exists.
 */
export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const inStock = product.stock > 0;

  function handleAdd() {
    if (!inStock) return;
    addItem(product, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  const href = `/products/${product.slug}`;
  const hoverImage = product.images[1];

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/5">
      <Link
        href={href}
        className="relative aspect-square overflow-hidden bg-muted"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
        />
        {hoverImage && (
          <Image
            src={hoverImage}
            alt=""
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}

        {!inStock && (
          <span className="absolute left-3 top-3 rounded-full bg-foreground/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-background backdrop-blur">
            Sold out
          </span>
        )}
        {product.featured && inStock && (
          <span className="absolute left-3 top-3 rounded-full bg-brand px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand-foreground">
            Bestseller
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={href} className="flex-1">
          <h3 className="line-clamp-1 text-sm font-medium text-foreground transition-colors group-hover:text-brand">
            {product.name}
          </h3>
        </Link>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="font-serif text-lg font-semibold text-brand">
            {formatCurrency(product.price, product.currency)}
          </span>
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={!inStock}
            className="rounded-full"
            aria-label={`Add ${product.name} to cart`}
          >
            {added ? (
              <>
                <Check className="size-4" /> Added
              </>
            ) : (
              <>
                <Plus className="size-4" /> Add
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
