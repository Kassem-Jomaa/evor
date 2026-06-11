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
 * button wired to the global cart store.
 */
export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  const href = `/products/${product.slug}`;

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md">
      <Link
        href={href}
        className="relative aspect-square overflow-hidden bg-muted"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
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
