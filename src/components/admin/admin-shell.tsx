"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  FolderTree,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ShoppingCart,
  X,
} from "lucide-react";
import { adminNav, type AdminNavLink } from "@/config/admin";
import { useAuthStore } from "@/stores/auth-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/utils/cn";

const ICONS: Record<AdminNavLink["icon"], typeof LayoutDashboard> = {
  dashboard: LayoutDashboard,
  categories: FolderTree,
  products: Package,
  orders: ShoppingCart,
  cms: ImageIcon,
};

/**
 * Admin dashboard chrome (Milestones 7–11): a sidebar of section links plus a
 * top bar with the signed-in user and a logout action. Wraps every admin page.
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const hydrated = useHydrated();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  function handleLogout() {
    logout();
    router.replace("/admin/login");
  }

  const nav = (
    <nav className="flex flex-col gap-1">
      {adminNav.map((link) => {
        const Icon = ICONS[link.icon];
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive(link.href)
                ? "bg-brand text-brand-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen">
      {/* Sidebar (desktop) */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-card p-4 lg:flex">
        <Link href="/admin" className="px-3 py-2">
          <span className="font-serif text-xl font-bold tracking-tight text-brand">
            EVOR
          </span>
          <span className="ml-1.5 text-xs font-medium text-muted-foreground">
            Admin
          </span>
        </Link>
        <div className="mt-6">{nav}</div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-14 items-center gap-3 border-b border-border bg-background px-4">
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-9 items-center justify-center rounded-md hover:bg-accent lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← View store
          </Link>
          <div className="ml-auto flex items-center gap-3">
            {hydrated && user && (
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {user.email}
              </span>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </header>

        {/* Mobile nav drawer */}
        {open && (
          <div className="border-b border-border bg-card p-4 lg:hidden">{nav}</div>
        )}

        <main className="flex-1 bg-muted/30 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
