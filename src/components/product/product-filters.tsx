"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/utils/cn";
import type { Category } from "@/types";

/** Min/max price bounds the user can narrow within (Task 4.3). */
export interface PriceRange {
  min: number;
  max: number;
}

/**
 * Catalog filters (Task 4.3): category selection and a price range. Controlled
 * by the parent catalog so multiple filters combine and update results live.
 */
export function ProductFilters({
  categories,
  selectedCategoryIds,
  onToggleCategory,
  priceBounds,
  priceRange,
  onPriceChange,
  onClear,
  hasActiveFilters,
  currency,
}: {
  categories: Category[];
  selectedCategoryIds: string[];
  onToggleCategory: (id: string) => void;
  /** Full min/max across the catalog — the slider's outer limits. */
  priceBounds: PriceRange;
  /** Currently selected range. */
  priceRange: PriceRange;
  onPriceChange: (range: PriceRange) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
  currency: string;
}) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-semibold">Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-muted-foreground"
          >
            <X className="size-4" /> Clear
          </Button>
        )}
      </div>

      {/* Category */}
      <fieldset className="space-y-3">
        <legend className="mb-3 text-sm font-medium text-foreground">
          Category
        </legend>
        {categories.map((category) => {
          const checked = selectedCategoryIds.includes(category.id);
          return (
            <label
              key={category.id}
              className="flex cursor-pointer items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggleCategory(category.id)}
                className="size-4 rounded border-input accent-brand"
              />
              <span className={cn(checked && "font-medium text-foreground")}>
                {category.name}
              </span>
            </label>
          );
        })}
      </fieldset>

      {/* Price range */}
      <fieldset className="space-y-3">
        <legend className="mb-3 text-sm font-medium text-foreground">
          Price range
        </legend>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{formatCurrency(priceRange.min, currency)}</span>
          <span>{formatCurrency(priceRange.max, currency)}</span>
        </div>
        <div className="space-y-2">
          <label className="sr-only" htmlFor="price-min">
            Minimum price
          </label>
          <input
            id="price-min"
            type="range"
            min={priceBounds.min}
            max={priceBounds.max}
            value={priceRange.min}
            onChange={(e) =>
              onPriceChange({
                min: Math.min(Number(e.target.value), priceRange.max),
                max: priceRange.max,
              })
            }
            className="w-full accent-brand"
          />
          <label className="sr-only" htmlFor="price-max">
            Maximum price
          </label>
          <input
            id="price-max"
            type="range"
            min={priceBounds.min}
            max={priceBounds.max}
            value={priceRange.max}
            onChange={(e) =>
              onPriceChange({
                min: priceRange.min,
                max: Math.max(Number(e.target.value), priceRange.min),
              })
            }
            className="w-full accent-brand"
          />
        </div>
      </fieldset>
    </div>
  );
}
