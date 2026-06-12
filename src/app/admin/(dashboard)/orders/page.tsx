"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { orderService } from "@/services/order.service";
import { formatCurrency } from "@/utils/format";
import type { Order } from "@/types";

/**
 * Admin orders table (Task 10.1). Orders are JWT-protected, and the token
 * lives in the browser — so this page fetches client-side, unlike the public
 * product/category tables which can render on the server.
 */
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    orderService
      .listAdmin()
      .then((data) => {
        if (!cancelled) setOrders(data);
      })
      .catch(() => {
        if (!cancelled)
          setError("Couldn't load orders — your session may have expired. Log out and sign in again.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const sorted = orders
    ? [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    : null;

  return (
    <div>
      <PageHeader
        title="Orders"
        description="Track and manage customer orders."
      />

      {error ? (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-6 text-center text-sm text-destructive"
        >
          {error}
        </p>
      ) : !sorted ? (
        <div className="flex justify-center rounded-lg border border-border bg-card py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium">Order #</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sorted.map((order) => (
                <tr
                  key={order.id}
                  className="cursor-pointer transition-colors hover:bg-accent/40"
                >
                  <td className="px-4 py-3 font-medium">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-brand hover:underline"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{order.customerName}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {order.phone}
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
