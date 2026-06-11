"use client";

import Image from "next/image";
import { OrderSummary } from "@/components/cart/order-summary";
import { formatCurrency } from "@/utils/format";
import type { CartItem } from "@/types";

/**
 * Order review (Task 6.2): the exact products, quantities and total from the
 * cart, shown read-only so the customer can confirm before placing the order.
 */
export function OrderReview({
  items,
  subtotal,
  currency,
}: {
  items: CartItem[];
  subtotal: number;
  currency: string;
}) {
  return (
    <div className="space-y-5">
      <ul className="divide-y divide-border rounded-lg border border-border bg-card">
        {items.map(({ product, quantity }) => (
          <li key={product.id} className="flex items-center gap-3 p-3">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
              {product.images[0] && (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              )}
              <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-brand text-[11px] font-semibold text-brand-foreground">
                {quantity}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-sm font-medium">{product.name}</p>
              <p className="text-xs text-muted-foreground">
                {quantity} × {formatCurrency(product.price, product.currency)}
              </p>
            </div>
            <p className="shrink-0 text-sm font-medium tabular-nums">
              {formatCurrency(product.price * quantity, product.currency)}
            </p>
          </li>
        ))}
      </ul>

      <OrderSummary subtotal={subtotal} currency={currency} />
    </div>
  );
}
