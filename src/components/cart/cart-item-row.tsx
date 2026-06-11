"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { formatCurrency } from "@/utils/format";
import type { CartItem } from "@/types";

/**
 * A single line in the cart (Task 5.3): image, title, unit price, quantity
 * stepper and remove action. Quantity changes flow straight to the store so
 * totals recompute automatically.
 */
export function CartItemRow({ item }: { item: CartItem }) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const { product, quantity } = item;
  const max = Math.max(product.stock, 1);
  const lineTotal = product.price * quantity;

  return (
    <div className="flex gap-4 py-5">
      <Link
        href={`/products/${product.slug}`}
        className="relative size-20 shrink-0 overflow-hidden rounded-md border border-border bg-muted sm:size-24"
      >
        {product.images[0] && (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="96px"
            className="object-cover"
          />
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex justify-between gap-4">
          <div className="min-w-0">
            <Link
              href={`/products/${product.slug}`}
              className="line-clamp-2 text-sm font-medium transition-colors hover:text-brand"
            >
              {product.name}
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatCurrency(product.price, product.currency)}
            </p>
          </div>
          <p className="shrink-0 font-medium tabular-nums">
            {formatCurrency(lineTotal, product.currency)}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center rounded-md border border-input">
            <button
              type="button"
              onClick={() => updateQuantity(product.id, quantity - 1)}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
              className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
            >
              <Minus className="size-3.5" />
            </button>
            <span className="w-9 text-center text-sm font-medium tabular-nums">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(product.id, quantity + 1)}
              disabled={quantity >= max}
              aria-label="Increase quantity"
              className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
            >
              <Plus className="size-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => removeItem(product.id)}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-destructive"
          >
            <Trash2 className="size-4" />
            <span className="hidden sm:inline">Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
}
