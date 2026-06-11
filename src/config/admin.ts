import type { OrderStatus } from "@/types";

/** A link in the admin sidebar. */
export interface AdminNavLink {
  href: string;
  label: string;
  /** lucide-react icon name, resolved in the sidebar. */
  icon: "dashboard" | "categories" | "products" | "orders" | "cms";
}

/** Admin dashboard navigation. */
export const adminNav: AdminNavLink[] = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/categories", label: "Categories", icon: "categories" },
  { href: "/admin/products", label: "Products", icon: "products" },
  { href: "/admin/orders", label: "Orders", icon: "orders" },
  { href: "/admin/cms", label: "Homepage", icon: "cms" },
];

/**
 * Ordered list of order statuses (Task 10.3). The order also defines the
 * natural progression shown in the order timeline.
 */
export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

/** Display label + badge styling for each order status. */
export const ORDER_STATUS_META: Record<
  OrderStatus,
  { label: string; badge: string }
> = {
  pending: {
    label: "Pending",
    badge: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  },
  confirmed: {
    label: "Confirmed",
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  },
  preparing: {
    label: "Preparing",
    badge:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300",
  },
  out_for_delivery: {
    label: "Out for delivery",
    badge:
      "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
  },
  delivered: {
    label: "Delivered",
    badge:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  },
  cancelled: {
    label: "Cancelled",
    badge: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  },
};
