import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/home/section-heading";
import { CategoryCard } from "@/components/home/category-card";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import type { Category } from "@/types";

/** Featured categories section (Task 3.2). Cards cascade in on scroll. */
export function FeaturedCategories({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            title="Shop by category"
            subtitle="Find the silhouette that fits your day"
            viewAllHref="/categories"
          />
        </Reveal>
        <StaggerGroup className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {categories.map((category) => (
            <StaggerItem key={category.id}>
              <CategoryCard category={category} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </section>
  );
}
