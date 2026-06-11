"use client";

import { useState } from "react";
import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import type { Product } from "@/types";

/**
 * Quantity selector + Add to Cart (Task 4.4). Clamps quantity to available
 * stock and disables when the product is sold out.
 */
export function AddToCartForm({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const inStock = product.stock > 0;
  const max = Math.max(product.stock, 1);

  function changeQuantity(next: number) {
    setQuantity(Math.min(Math.max(next, 1), max));
  }

  function handleAdd() {
    if (!inStock) return;
    addItem(product, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-foreground">Quantity</span>
        <div className="flex items-center rounded-md border border-input">
          <button
            type="button"
            onClick={() => changeQuantity(quantity - 1)}
            disabled={!inStock || quantity <= 1}
            aria-label="Decrease quantity"
            className="flex size-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
          >
            <Minus className="size-4" />
          </button>
          <span
            className="w-10 text-center text-sm font-medium tabular-nums"
            aria-live="polite"
          >
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => changeQuantity(quantity + 1)}
            disabled={!inStock || quantity >= max}
            aria-label="Increase quantity"
            className="flex size-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>

      <Button
        size="lg"
        onClick={handleAdd}
        disabled={!inStock}
        className="w-full sm:w-auto"
      >
        {!inStock ? (
          "Out of stock"
        ) : added ? (
          <>
            <Check className="size-4" /> Added to cart
          </>
        ) : (
          <>
            <ShoppingBag className="size-4" /> Add to cart
          </>
        )}
      </Button>
    </div>
  );
}
