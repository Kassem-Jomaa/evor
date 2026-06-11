"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ORDER_STATUSES, ORDER_STATUS_META } from "@/config/admin";
import { orderService } from "@/services/order.service";
import type { OrderStatus } from "@/types";

/**
 * Update an order's status (Task 10.3). Submits the chosen status to the API
 * and refreshes the page so the badge and timeline reflect the change.
 */
export function OrderStatusControl({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const router = useRouter();
  const [value, setValue] = useState<OrderStatus>(status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty = value !== status;

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await orderService.updateStatus(orderId, value);
      router.refresh();
    } catch {
      setError("Couldn't update status.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-2">
      <label htmlFor="order-status" className="text-sm font-medium">
        Update status
      </label>
      <div className="flex gap-2">
        <select
          id="order-status"
          value={value}
          onChange={(e) => setValue(e.target.value as OrderStatus)}
          disabled={saving}
          className="h-9 flex-1 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30"
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_META[s].label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleSave}
          disabled={!dirty || saving}
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {saving && <Loader2 className="size-4 animate-spin" />}
          Save
        </button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
