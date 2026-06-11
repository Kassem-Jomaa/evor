"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import {
  ProductFilters,
  type PriceRange,
} from "@/components/product/product-filters";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import type { Category, Product } from "@/types";

/** Round bounds outward to whole units so the slider ends sit on clean values. */
function priceBoundsOf(products: Product[]): PriceRange {
  if (products.length === 0) return { min: 0, max: 0 };
  const prices = products.map((p) => p.price);
  return {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices)),
  };
}

/**
 * Interactive product catalog (Tasks 4.1–4.3). Receives the full product list
 * from the server and filters it in the browser, so search and filters update
 * results instantly without a round-trip.
 */
export function ProductCatalog({
  products,
  categories,
  initialQuery = "",
}: {
  products: Product[];
  categories: Category[];
  initialQuery?: string;
}) {
  const bounds = useMemo(() => priceBoundsOf(products), [products]);

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<PriceRange>(bounds);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Only show categories that actually have products in this catalog.
  const visibleCategories = useMemo(() => {
    const present = new Set(products.map((p) => p.categoryId));
    return categories.filter((c) => present.has(c.id));
  }, [products, categories]);

  const currency = products[0]?.currency ?? "USD";

  const hasActiveFilters =
    selectedCategoryIds.length > 0 ||
    priceRange.min > bounds.min ||
    priceRange.max < bounds.max;

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return products.filter((product) => {
      if (
        term &&
        !product.name.toLowerCase().includes(term) &&
        !product.sku.toLowerCase().includes(term)
      ) {
        return false;
      }
      if (
        selectedCategoryIds.length > 0 &&
        !selectedCategoryIds.includes(product.categoryId)
      ) {
        return false;
      }
      if (product.price < priceRange.min || product.price > priceRange.max) {
        return false;
      }
      return true;
    });
  }, [products, query, selectedCategoryIds, priceRange]);

  function toggleCategory(id: string) {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  }

  function clearFilters() {
    setSelectedCategoryIds([]);
    setPriceRange(bounds);
  }

  const filters = (
    <ProductFilters
      categories={visibleCategories}
      selectedCategoryIds={selectedCategoryIds}
      onToggleCategory={toggleCategory}
      priceBounds={bounds}
      priceRange={priceRange}
      onPriceChange={setPriceRange}
      onClear={clearFilters}
      hasActiveFilters={hasActiveFilters}
      currency={currency}
    />
  );

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      {/* Sidebar filters (desktop) */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-24">{filters}</div>
      </aside>

      <div className="min-w-0 flex-1">
        {/* Search + mobile filter toggle */}
        <div className="mb-6 flex items-center gap-3">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or SKU…"
              aria-label="Search products"
              className="h-10 w-full rounded-full border border-input bg-background pl-9 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30"
            />
          </div>
          <Button
            variant="outline"
            className="lg:hidden"
            onClick={() => setFiltersOpen((open) => !open)}
            aria-expanded={filtersOpen}
          >
            <SlidersHorizontal className="size-4" /> Filters
          </Button>
        </div>

        {/* Collapsible filters (mobile) */}
        <div
          className={cn(
            "mb-6 rounded-lg border border-border bg-card p-5 lg:hidden",
            filtersOpen ? "block" : "hidden",
          )}
        >
          {filters}
        </div>

        <p className="mb-4 text-sm text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "product" : "products"}
        </p>

        {filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-20 text-center">
            <p className="text-sm text-muted-foreground">
              No products match your search.
            </p>
            {hasActiveFilters && (
              <Button
                variant="link"
                onClick={clearFilters}
                className="mt-1 text-brand"
              >
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
