"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { categoryService } from "@/services/category.service";
import type { Category } from "@/types";

/**
 * Create/edit form for a category (Task 8.2). Fields: name, image and active
 * status. Submits to the category service and returns to the table.
 */
export function CategoryForm({ category }: { category?: Category }) {
  const router = useRouter();
  const editing = Boolean(category);

  const [name, setName] = useState(category?.name ?? "");
  const [image, setImage] = useState(category?.image ?? "");
  const [active, setActive] = useState(category?.active ?? true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    const payload = { name: name.trim(), image: image.trim() || undefined, active };
    try {
      if (editing && category) {
        await categoryService.update(category.id, payload);
      } else {
        await categoryService.create(payload);
      }
      router.push("/admin/categories");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="max-w-xl space-y-5 rounded-lg border border-border bg-card p-6"
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
          Name <span className="text-destructive">*</span>
        </label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="image" className="text-sm font-medium">
          Image URL
        </label>
        <input
          id="image"
          type="url"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="https://…"
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30"
        />
        {image.trim() && (
          <div className="relative mt-2 size-24 overflow-hidden rounded-md border border-border bg-muted">
            <Image
              src={image.trim()}
              alt="Category preview"
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>
        )}
      </div>

      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
          className="size-4 rounded border-input accent-brand"
        />
        <span className="font-medium">Active</span>
        <span className="text-muted-foreground">
          (visible in the storefront)
        </span>
      </label>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={submitting}>
          {submitting
            ? "Saving…"
            : editing
              ? "Save changes"
              : "Create category"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/categories")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
