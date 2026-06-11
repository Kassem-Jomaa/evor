"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/utils/cn";

/**
 * Cart link showing the live item count, e.g. "Cart (3)".
 * The count is read from the persisted Zustand store; rendering is deferred
 * until after mount to avoid a hydration mismatch with the localStorage value.
 */
export function CartButton({ className }: { className?: string }) {
  const count = useCartStore((state) =>
    state.items.reduce((sum, i) => sum + i.quantity, 0),
  );
  const mounted = useHydrated();

  return (
    <Link
      href="/cart"
      aria-label={`Cart, ${mounted ? count : 0} items`}
      className={cn(
        "relative inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
        className,
      )}
    >
      <span className="relative">
        <ShoppingBag className="size-5" />
        {mounted && count > 0 && (
          <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-brand text-[10px] font-semibold leading-none text-brand-foreground">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </span>
      <span className="hidden sm:inline">Cart ({mounted ? count : 0})</span>
    </Link>
  );
}
