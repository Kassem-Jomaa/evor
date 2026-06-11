import { HeroBanner } from "@/components/home/hero-banner";
import { Marquee } from "@/components/home/marquee";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { Editorial } from "@/components/home/editorial";
import { FeaturedProducts } from "@/components/home/featured-products";
import { Newsletter } from "@/components/home/newsletter";
import { cmsService } from "@/services/cms.service";
import { categoryService } from "@/services/category.service";
import { productService } from "@/services/product.service";

// Content is admin-editable (CMS/API), so render per request rather than
// freezing it at build time.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [cms, categories, featured] = await Promise.all([
    cmsService.getHomepage(),
    categoryService.list(),
    productService.getFeatured(),
  ]);

  return (
    <>
      <HeroBanner content={cms.hero} />
      <Marquee />
      <FeaturedCategories categories={categories} />
      <FeaturedProducts products={featured} />
      <Editorial />
      <Newsletter />
    </>
  );
}
