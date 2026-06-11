import { ORDER_STATUS_META } from "@/config/admin";
import { cn } from "@/utils/cn";
import type { OrderStatus } from "@/types";

/** Coloured pill showing an order's status (Tasks 10.1–10.3). */
export function StatusBadge({ status }: { status: OrderStatus }) {
  const meta = ORDER_STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        meta.badge,
      )}
    >
      {meta.label}
    </span>
  );
}
