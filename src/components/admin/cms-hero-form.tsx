"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cmsService } from "@/services/cms.service";
import type { HeroContent } from "@/types";

/**
 * Homepage hero editor (Task 11.1). Lets a non-technical admin edit the hero
 * title, subtitle, image and CTA button, saving via `PATCH /cms`.
 */
export function CmsHeroForm({ hero }: { hero: HeroContent }) {
  const router = useRouter();
  const [values, setValues] = useState<HeroContent>(hero);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setField(field: keyof HeroContent, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await cmsService.updateHero(values);
      setSaved(true);
      router.refresh();
    } catch {
      setError("Couldn't save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30";

  return (
    <form
      onSubmit={handleSubmit}
      className="grid max-w-4xl gap-6 lg:grid-cols-[1fr_320px]"
    >
      <div className="space-y-5 rounded-lg border border-border bg-card p-6">
        {error && (
          <p
            role="alert"
            className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {error}
          </p>
        )}

        <div className="space-y-1.5">
          <label htmlFor="title" className="text-sm font-medium">
            Hero title
          </label>
          <input
            id="title"
            value={values.title}
            onChange={(e) => setField("title", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="subtitle" className="text-sm font-medium">
            Hero subtitle
          </label>
          <textarea
            id="subtitle"
            value={values.subtitle}
            onChange={(e) => setField("subtitle", e.target.value)}
            rows={3}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="image" className="text-sm font-medium">
            Hero image URL
          </label>
          <input
            id="image"
            type="url"
            value={values.image}
            onChange={(e) => setField("image", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="ctaLabel" className="text-sm font-medium">
              CTA button label
            </label>
            <input
              id="ctaLabel"
              value={values.ctaLabel}
              onChange={(e) => setField("ctaLabel", e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="ctaHref" className="text-sm font-medium">
              CTA button link
            </label>
            <input
              id="ctaHref"
              value={values.ctaHref}
              onChange={(e) => setField("ctaHref", e.target.value)}
              placeholder="/shop"
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-500">
              <CheckCircle2 className="size-4" /> Saved
            </span>
          )}
        </div>
      </div>

      {/* Live preview */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Preview</p>
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-border bg-muted">
          {values.image && (
            <Image
              src={values.image}
              alt="Hero preview"
              fill
              sizes="320px"
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <h3 className="font-serif text-xl font-bold leading-tight">
              {values.title || "Hero title"}
            </h3>
            <p className="mt-1 line-clamp-2 text-xs text-white/80">
              {values.subtitle || "Hero subtitle"}
            </p>
            <span className="mt-3 inline-block rounded-md bg-brand px-3 py-1.5 text-xs font-medium text-brand-foreground">
              {values.ctaLabel || "Shop now"}
            </span>
          </div>
        </div>
      </div>
    </form>
  );
}
