import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { ProductForm } from "@/components/admin/product-form";
import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [catalog, categories] = await Promise.all([
    productService.list(),
    categoryService.list(),
  ]);
  const product = catalog.items.find((p) => p.id === id);

  if (!product) notFound();

  return (
    <div>
      <PageHeader title="Edit product" description={`Update “${product.name}”.`} />
      <ProductForm categories={categories} product={product} />
    </div>
  );
}
