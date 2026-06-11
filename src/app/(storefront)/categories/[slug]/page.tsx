import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { ProductCard } from "@/components/product/product-card";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { categoryService } from "@/services/category.service";
import { productService } from "@/services/product.service";

export const dynamic = "force-dynamic";

async function findCategory(slug: string) {
  const categories = await categoryService.list();
  return categories.find((category) => category.slug === slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await findCategory(slug);
  if (!category) return { title: "Category not found" };
  return {
    title: category.name,
    description: `Shop ${category.name} from the EVOR collection.`,
  };
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await findCategory(slug);
  if (!category) notFound();

  const catalog = await productService.list({ categoryId: category.id });

  return (
    <>
      {/* Category banner */}
      <section className="relative isolate overflow-hidden border-b border-border">
        {category.image && (
          <Image
            src={category.image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/30" />
        <Container className="relative py-16 sm:py-24">
          <nav
            aria-label="Breadcrumb"
            className="mb-4 flex items-center gap-1 text-sm text-muted-foreground"
          >
            <Link
              href="/categories"
              className="transition-colors hover:text-foreground"
            >
              Categories
            </Link>
            <ChevronRight className="size-4" />
            <span className="text-foreground">{category.name}</span>
          </nav>
          <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-5xl">
            {category.name}
          </h1>
          <p className="mt-3 max-w-md text-muted-foreground">
            {catalog.items.length}{" "}
            {catalog.items.length === 1 ? "piece" : "pieces"} in this
            collection.
          </p>
        </Container>
      </section>

      <Container className="py-12 sm:py-16">
        {catalog.items.length === 0 ? (
          <Reveal>
            <p className="rounded-lg border border-dashed border-border py-20 text-center text-sm text-muted-foreground">
              Nothing here yet — check back soon.
            </p>
          </Reveal>
        ) : (
          <StaggerGroup className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {catalog.items.map((product) => (
              <StaggerItem key={product.id}>
                <ProductCard product={product} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}
      </Container>
    </>
  );
}
