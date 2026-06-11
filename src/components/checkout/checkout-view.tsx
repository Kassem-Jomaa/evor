"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CheckoutForm,
  type CheckoutFormValues,
} from "@/components/checkout/checkout-form";
import { OrderReview } from "@/components/checkout/order-review";
import { useCartStore } from "@/stores/cart-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { orderService } from "@/services/order.service";
import type { OrderItem } from "@/types";

/**
 * Checkout flow (Tasks 6.1–6.3): collect customer details, review the cart, and
 * place a cash-on-delivery order. On success the cart is cleared and the order
 * number is shown.
 */
export function CheckoutView() {
  const items = useCartStore((state) => state.items);
  const clear = useCartStore((state) => state.clear);
  const hydrated = useHydrated();

  const [submitting, setSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!hydrated) return null;

  // Order placed — confirmation takes priority over the now-empty cart.
  if (orderNumber) {
    return (
      <div className="mx-auto max-w-md rounded-lg border border-border bg-card py-14 text-center">
        <CheckCircle2 className="mx-auto size-12 text-emerald-600 dark:text-emerald-500" />
        <h2 className="mt-4 font-serif text-2xl font-semibold">
          Order confirmed
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Thanks for your order! Pay with cash on delivery.
        </p>
        <p className="mt-4 text-sm">
          Your order number is{" "}
          <span className="font-semibold text-brand">{orderNumber}</span>
        </p>
        <Button asChild className="mt-6">
          <Link href="/shop">Continue shopping</Link>
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border py-20 text-center">
        <ShoppingBag className="mx-auto size-10 text-muted-foreground" />
        <p className="mt-4 text-sm text-muted-foreground">
          Your cart is empty — add something before checking out.
        </p>
        <Button asChild className="mt-5">
          <Link href="/shop">Browse products</Link>
        </Button>
      </div>
    );
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const currency = items[0]?.product.currency ?? "USD";

  async function handleSubmit(values: CheckoutFormValues) {
    setSubmitting(true);
    setError(null);

    const orderItems: OrderItem[] = items.map(({ product, quantity }) => ({
      productId: product.id,
      title: product.name,
      price: product.price,
      quantity,
    }));

    try {
      const response = await orderService.create({
        customerName: values.customerName.trim(),
        phone: values.phone.trim(),
        address: values.address.trim(),
        city: values.city.trim(),
        notes: values.notes.trim() || undefined,
        items: orderItems,
      });
      clear();
      setOrderNumber(response.orderNumber);
    } catch {
      setError("We couldn't place your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_400px] lg:gap-16">
      <div>
        <h2 className="mb-5 font-serif text-lg font-semibold">
          Delivery details
        </h2>
        {error && (
          <p
            role="alert"
            className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {error}
          </p>
        )}
        <CheckoutForm onSubmit={handleSubmit} submitting={submitting} />
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <h2 className="mb-5 font-serif text-lg font-semibold">Order review</h2>
        <OrderReview items={items} subtotal={subtotal} currency={currency} />
      </aside>
    </div>
  );
}
