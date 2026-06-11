import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/home/section-heading";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/types";

/** Featured products section (Task 3.3). */
export function FeaturedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="border-t border-border bg-secondary/30 py-16 sm:py-20">
      <Container>
        <SectionHeading
          title="Featured products"
          subtitle="Handpicked favorites, just for you"
          viewAllHref="/shop"
        />
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}
