import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { CategoryCard } from "@/components/home/category-card";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { categoryService } from "@/services/category.service";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse every EVOR collection — totes, shoulder bags, crossbody bags and clutches.",
};

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await categoryService.list();
  const visible = categories.filter((category) => category.active !== false);

  return (
    <Container className="py-12 sm:py-16">
      <Reveal>
        <header className="mb-10 max-w-xl">
          <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand">
            <span className="h-px w-8 bg-brand" aria-hidden />
            Collections
          </p>
          <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-5xl">
            Shop by category
          </h1>
          <p className="mt-3 text-muted-foreground">
            Every silhouette in the EVOR collection — find the one that carries
            your day.
          </p>
        </header>
      </Reveal>

      <StaggerGroup className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {visible.map((category) => (
          <StaggerItem key={category.id}>
            <CategoryCard category={category} />
          </StaggerItem>
        ))}
      </StaggerGroup>

      {visible.length === 0 && (
        <p className="rounded-lg border border-dashed border-border py-20 text-center text-sm text-muted-foreground">
          No categories available yet.
        </p>
      )}
    </Container>
  );
}
