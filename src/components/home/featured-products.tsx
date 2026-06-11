import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/home/section-heading";
import { ProductCard } from "@/components/product/product-card";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import type { Product } from "@/types";

/** Featured products section (Task 3.3). Cards cascade in on scroll. */
export function FeaturedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="border-t border-border bg-secondary/30 py-16 sm:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            title="Bestsellers"
            subtitle="The bags our customers reach for, again and again"
            viewAllHref="/shop"
          />
        </Reveal>
        <StaggerGroup className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {products.map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </section>
  );
}
