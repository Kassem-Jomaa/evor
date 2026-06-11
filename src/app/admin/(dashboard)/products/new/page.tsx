import { PageHeader } from "@/components/admin/page-header";
import { ProductForm } from "@/components/admin/product-form";
import { categoryService } from "@/services/category.service";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await categoryService.list();

  return (
    <div>
      <PageHeader
        title="New product"
        description="Add a product to your catalog."
      />
      <ProductForm categories={categories} />
    </div>
  );
}
