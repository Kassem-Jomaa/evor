/**
 * Cart / checkout pricing rules (Task 5.4). Centralized here so the cart page,
 * order summary and any future checkout step agree on how totals are computed.
 */

/** Flat shipping fee applied to paid orders below the free-shipping threshold. */
export const SHIPPING_FLAT_RATE = 8;

/** Order subtotal at or above which shipping is free. */
export const FREE_SHIPPING_THRESHOLD = 100;

export interface CartTotals {
  subtotal: number;
  shipping: number;
  total: number;
}

/**
 * Derive the order summary figures from a subtotal. Shipping is free for empty
 * carts and for subtotals that reach the free-shipping threshold.
 */
export function calculateTotals(subtotal: number): CartTotals {
  const shipping =
    subtotal <= 0 || subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : SHIPPING_FLAT_RATE;
  return { subtotal, shipping, total: subtotal + shipping };
}
