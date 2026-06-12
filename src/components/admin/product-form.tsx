"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { productService } from "@/services/product.service";
import type { Category, Product, ProductInput } from "@/types";

/**
 * Create/edit form for a product (Task 9.2). Collects title, description,
 * price, stock, category, images and the featured flag, then submits to the
 * product service.
 */
export function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: Product;
}) {
  const router = useRouter();
  const editing = Boolean(product);

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [stock, setStock] = useState(product ? String(product.stock) : "");
  const [sku, setSku] = useState(product?.sku ?? "");
  const [categoryId, setCategoryId] = useState(
    product?.categoryId ?? categories[0]?.id ?? "",
  );
  const [imagesText, setImagesText] = useState(
    product?.images.join("\n") ?? "",
  );
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const images = imagesText
      .split(/[\n,]/)
      .map((url) => url.trim())
      .filter(Boolean);
    const priceNum = Number(price);
    const stockNum = Number(stock);

    if (!name.trim()) return setError("Title is required.");
    if (!description.trim()) return setError("Description is required.");
    if (!Number.isFinite(priceNum) || priceNum < 0)
      return setError("Enter a valid price.");
    if (!Number.isInteger(stockNum) || stockNum < 0)
      return setError("Enter a valid stock quantity.");
    if (!categoryId) return setError("Select a category.");
    if (images.length === 0) return setError("Add at least one image URL.");

    const payload: ProductInput = {
      name: name.trim(),
      description: description.trim(),
      price: priceNum,
      stock: stockNum,
      categoryId,
      images,
      featured,
      sku: sku.trim() || undefined,
    };

    setSubmitting(true);
    setError(null);
    try {
      if (editing && product) {
        await productService.update(product.id, payload);
      } else {
        await productService.create(payload);
      }
      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  const inputClass =
    "h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="max-w-2xl space-y-5 rounded-lg border border-border bg-card p-6"
    >
      {error && (
        <p
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </p>
      )}

      <div className="space-y-1.5">
        <label htmlFor="name" className="text-sm font-medium">
          Title <span className="text-destructive">*</span>
        </label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="description" className="text-sm font-medium">
          Description <span className="text-destructive">*</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label htmlFor="price" className="text-sm font-medium">
            Price <span className="text-destructive">*</span>
          </label>
          <input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="stock" className="text-sm font-medium">
            Stock <span className="text-destructive">*</span>
          </label>
          <input
            id="stock"
            type="number"
            min="0"
            step="1"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="sku" className="text-sm font-medium">
            SKU
          </label>
          <input
            id="sku"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="Auto"
            className={inputClass}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="category" className="text-sm font-medium">
          Category <span className="text-destructive">*</span>
        </label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className={inputClass}
        >
          {categories.length === 0 && <option value="">No categories</option>}
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="images" className="text-sm font-medium">
          Images <span className="text-destructive">*</span>
        </label>
        <textarea
          id="images"
          value={imagesText}
          onChange={(e) => setImagesText(e.target.value)}
          rows={3}
          placeholder="One image URL per line"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30"
        />
        <p className="text-xs text-muted-foreground">
          One URL per line. The first image is used as the main image.
        </p>
      </div>

      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="size-4 rounded border-input accent-brand"
        />
        <span className="font-medium">Featured</span>
        <span className="text-muted-foreground">(show on the homepage)</span>
      </label>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={submitting}>
          {submitting
            ? "Saving…"
            : editing
              ? "Save changes"
              : "Create product"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/products")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
