import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { orderService } from "@/services/order.service";
import { formatCurrency } from "@/utils/format";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await orderService.listAdmin();
  const sorted = [...orders].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  return (
    <div>
      <PageHeader
        title="Orders"
        description="Track and manage customer orders."
      />

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
    </div>
  );
}
