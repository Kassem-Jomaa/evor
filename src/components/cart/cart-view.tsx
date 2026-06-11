"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItemRow } from "@/components/cart/cart-item-row";
import { OrderSummary } from "@/components/cart/order-summary";
import { useCartStore } from "@/stores/cart-store";
import { useHydrated } from "@/hooks/use-hydrated";

/**
 * Cart page contents (Tasks 5.3–5.4). Lists items with live quantity controls
 * and an order summary. Rendering is deferred until mount so the persisted
 * localStorage cart doesn't cause a hydration mismatch.
 */
export function CartView() {
  const items = useCartStore((state) => state.items);
  const clear = useCartStore((state) => state.clear);

  const hydrated = useHydrated();

  if (!hydrated) return null;

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border py-20 text-center">
        <ShoppingBag className="mx-auto size-10 text-muted-foreground" />
        <p className="mt-4 text-sm text-muted-foreground">Your cart is empty.</p>
        <Button asChild className="mt-5">
          <Link href="/shop">Continue shopping</Link>
        </Button>
      </div>
    );
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const currency = items[0]?.product.currency ?? "USD";

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-16">
      <div>
        <div className="flex items-center justify-between border-b border-border pb-3">
          <p className="text-sm text-muted-foreground">
            {items.length} {items.length === 1 ? "item" : "items"}
          </p>
          <button
            type="button"
            onClick={clear}
            className="text-sm text-muted-foreground transition-colors hover:text-destructive"
          >
            Clear cart
          </button>
        </div>

        <ul className="divide-y divide-border">
          {items.map((item) => (
            <li key={item.product.id}>
              <CartItemRow item={item} />
            </li>
          ))}
        </ul>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <OrderSummary
          subtotal={subtotal}
          currency={currency}
          cta={
            <Button asChild size="lg" className="w-full">
              <Link href="/checkout">
                Checkout
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          }
        />
      </aside>
    </div>
  );
}
