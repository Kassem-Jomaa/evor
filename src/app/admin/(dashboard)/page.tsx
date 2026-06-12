"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FolderTree, Loader2, Package, ShoppingCart } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";
import { orderService } from "@/services/order.service";
import { formatCurrency } from "@/utils/format";
import type { Category, Order, Paginated, Product } from "@/types";

interface DashboardData {
  catalog: Paginated<Product>;
  categories: Category[];
  orders: Order[];
}

/**
 * Admin overview. Fetches client-side: the orders endpoint needs the JWT,
 * which only exists in the browser.
 */
export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      productService.list(),
      categoryService.list(),
      orderService.listAdmin(),
    ])
      .then(([catalog, categories, orders]) => {
        if (!cancelled) setData({ catalog, categories, orders });
      })
      .catch(() => {
        if (!cancelled)
          setError("Couldn't load the dashboard — your session may have expired. Log out and sign in again.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <p
        role="alert"
        className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-6 text-center text-sm text-destructive"
      >
        {error}
      </p>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const { catalog, categories, orders } = data;

  const revenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);
  const pending = orders.filter((o) => o.status === "pending").length;

  const stats = [
    {
      label: "Products",
      value: catalog.total,
      href: "/admin/products",
      icon: Package,
    },
    {
      label: "Categories",
      value: categories.length,
      href: "/admin/categories",
      icon: FolderTree,
    },
    {
      label: "Orders",
      value: orders.length,
      href: "/admin/orders",
      icon: ShoppingCart,
    },
  ];

  const recent = [...orders]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="An overview of your store activity."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-brand/50"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <stat.icon className="size-4 text-muted-foreground" />
            </div>
            <p className="mt-2 font-serif text-3xl font-bold">{stat.value}</p>
          </Link>
        ))}
        <div className="rounded-lg border border-border bg-card p-5">
          <span className="text-sm text-muted-foreground">Revenue</span>
          <p className="mt-2 font-serif text-3xl font-bold text-brand">
            {formatCurrency(revenue)}
          </p>
          {pending > 0 && (
            <p className="mt-1 text-xs text-muted-foreground">
              {pending} pending
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-semibold">Recent orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm font-medium text-brand hover:underline"
          >
            View all
          </Link>
        </div>
        <ul className="divide-y divide-border">
          {recent.map((order) => (
            <li key={order.id}>
              <Link
                href={`/admin/orders/${order.id}`}
                className="flex items-center justify-between gap-4 px-5 py-3 text-sm transition-colors hover:bg-accent/50"
              >
                <span className="font-medium">{order.orderNumber}</span>
                <span className="hidden flex-1 truncate text-muted-foreground sm:block">
                  {order.customerName}
                </span>
                <span className="tabular-nums">
                  {formatCurrency(order.total)}
                </span>
                <StatusBadge status={order.status} />
              </Link>
            </li>
          ))}
          {recent.length === 0 && (
            <li className="px-5 py-10 text-center text-sm text-muted-foreground">
              No orders yet.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
