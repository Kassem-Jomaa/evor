import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Phone, User } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { OrderStatusControl } from "@/components/admin/order-status-control";
import { ORDER_STATUS_META } from "@/config/admin";
import { orderService } from "@/services/order.service";
import { formatCurrency, formatDateTime } from "@/utils/format";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await orderService.getAdmin(id);

  if (!order) notFound();

  const timeline = [...(order.timeline ?? [])].sort((a, b) =>
    b.at.localeCompare(a.at),
  );

  return (
    <div>
      <Link
        href="/admin/orders"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to orders
      </Link>

      <PageHeader
        title={order.orderNumber}
        description={`Placed ${formatDateTime(order.createdAt)}`}
        action={<StatusBadge status={order.status} />}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main column: products + customer */}
        <div className="space-y-6 lg:col-span-2">
          {/* Products */}
          <section className="rounded-lg border border-border bg-card">
            <h2 className="border-b border-border px-5 py-3 font-semibold">
              Products
            </h2>
            <ul className="divide-y divide-border">
              {order.items.map((item) => (
                <li
                  key={item.productId}
                  className="flex items-center justify-between gap-4 px-5 py-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{item.title}</p>
                    <p className="text-muted-foreground">
                      {item.quantity} × {formatCurrency(item.price)}
                    </p>
                  </div>
                  <span className="shrink-0 font-medium tabular-nums">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <dl className="space-y-2 border-t border-border px-5 py-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="tabular-nums">{formatCurrency(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd className="tabular-nums">
                  {order.shipping === 0 ? "Free" : formatCurrency(order.shipping)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
                <dt>Total</dt>
                <dd className="text-brand tabular-nums">
                  {formatCurrency(order.total)}
                </dd>
              </div>
            </dl>
          </section>

          {/* Customer information */}
          <section className="rounded-lg border border-border bg-card p-5">
            <h2 className="mb-4 font-semibold">Customer information</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <User className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <dd>{order.customerName}</dd>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <dd>{order.phone}</dd>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <dd>
                  {order.address}
                  {order.city ? `, ${order.city}` : ""}
                </dd>
              </div>
            </dl>
            {order.notes && (
              <p className="mt-4 rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Notes: </span>
                {order.notes}
              </p>
            )}
          </section>
        </div>

        {/* Side column: status control + timeline */}
        <div className="space-y-6">
          <section className="rounded-lg border border-border bg-card p-5">
            <OrderStatusControl orderId={order.id} status={order.status} />
          </section>

          <section className="rounded-lg border border-border bg-card p-5">
            <h2 className="mb-4 font-semibold">Order timeline</h2>
            {timeline.length === 0 ? (
              <p className="text-sm text-muted-foreground">No history yet.</p>
            ) : (
              <ol className="space-y-4">
                {timeline.map((event, index) => (
                  <li key={`${event.status}-${event.at}`} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={
                          "mt-1 size-2.5 rounded-full " +
                          (index === 0 ? "bg-brand" : "bg-border")
                        }
                      />
                      {index < timeline.length - 1 && (
                        <span className="w-px flex-1 bg-border" />
                      )}
                    </div>
                    <div className="pb-1">
                      <p className="text-sm font-medium">
                        {ORDER_STATUS_META[event.status].label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(event.at)}
                      </p>
                      {event.note && (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {event.note}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
