import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { ProductCatalog } from "@/components/product/product-catalog";
import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse the full EVOR collection.",
};

// Catalog is API-driven, so render per request rather than freezing at build.
export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const [catalog, categories] = await Promise.all([
    productService.list(),
    categoryService.list(),
  ]);

  return (
    <Container className="py-10 sm:py-14">
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          Shop
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Browse the full EVOR collection — search and filter to find your next
          favorite.
        </p>
      </header>

      <ProductCatalog
        products={catalog.items}
        categories={categories}
        initialQuery={q ?? ""}
      />
    </Container>
  );
}
