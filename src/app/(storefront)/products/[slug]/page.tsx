import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Star } from "lucide-react";
import { Container } from "@/components/layout/container";
import { ProductGallery } from "@/components/product/product-gallery";
import { AddToCartForm } from "@/components/product/add-to-cart-form";
import { productService } from "@/services/product.service";
import { formatCurrency } from "@/utils/format";

// Product data is API-driven, so render per request.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await productService.getBySlug(slug);
  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description: product.description,
    openGraph: { images: product.images.slice(0, 1) },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await productService.getBySlug(slug);

  if (!product) notFound();

  const inStock = product.stock > 0;

  return (
    <Container className="py-10 sm:py-14">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-8 flex items-center gap-1 text-sm text-muted-foreground"
      >
        <Link href="/shop" className="transition-colors hover:text-foreground">
          Shop
        </Link>
        <ChevronRight className="size-4" />
        <span className="truncate text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images} alt={product.name} />

        <div className="flex flex-col">
          <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-4">
            <span className="font-serif text-2xl font-semibold text-brand">
              {formatCurrency(product.price, product.currency)}
            </span>
            {typeof product.rating === "number" && (
              <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                {product.rating.toFixed(1)}
              </span>
            )}
          </div>

          <p className="mt-2 text-sm">
            {inStock ? (
              <span className="text-emerald-600 dark:text-emerald-500">
                In stock
                {product.stock <= 10 ? ` — only ${product.stock} left` : ""}
              </span>
            ) : (
              <span className="text-destructive">Out of stock</span>
            )}
          </p>

          <p className="mt-6 leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <p className="mt-4 text-xs uppercase tracking-wide text-muted-foreground">
            SKU: {product.sku}
          </p>

          <div className="mt-8 border-t border-border pt-8">
            <AddToCartForm product={product} />
          </div>
        </div>
      </div>
    </Container>
  );
}
