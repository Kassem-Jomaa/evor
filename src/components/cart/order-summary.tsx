"use client";

import {
  calculateTotals,
  FREE_SHIPPING_THRESHOLD,
} from "@/config/cart";
import { formatCurrency } from "@/utils/format";

/**
 * Order summary (Task 5.4): subtotal, shipping and total derived from the cart
 * subtotal. Re-renders whenever the parent passes a new subtotal, so the
 * figures always match the cart. An optional `cta` renders at the bottom (e.g.
 * a Checkout button on the cart page); the checkout page omits it.
 */
export function OrderSummary({
  subtotal,
  currency,
  cta,
}: {
  subtotal: number;
  currency: string;
  cta?: React.ReactNode;
}) {
  const { shipping, total } = calculateTotals(subtotal);
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h2 className="font-serif text-lg font-semibold">Order summary</h2>

      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Subtotal</dt>
          <dd className="font-medium tabular-nums">
            {formatCurrency(subtotal, currency)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Shipping</dt>
          <dd className="font-medium tabular-nums">
            {shipping === 0 ? "Free" : formatCurrency(shipping, currency)}
          </dd>
        </div>

        {shipping > 0 && remainingForFreeShipping > 0 && (
          <p className="text-xs text-muted-foreground">
            Add {formatCurrency(remainingForFreeShipping, currency)} more for
            free shipping.
          </p>
        )}

        <div className="flex justify-between border-t border-border pt-3 text-base">
          <dt className="font-semibold">Total</dt>
          <dd className="font-serif font-semibold text-brand tabular-nums">
            {formatCurrency(total, currency)}
          </dd>
        </div>
      </dl>

      {cta && <div className="mt-6">{cta}</div>}
    </div>
  );
}
