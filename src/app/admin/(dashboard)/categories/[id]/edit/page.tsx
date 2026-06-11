import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { CategoryForm } from "@/components/admin/category-form";
import { categoryService } from "@/services/category.service";

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const categories = await categoryService.list();
  const category = categories.find((c) => c.id === id);

  if (!category) notFound();

  return (
    <div>
      <PageHeader
        title="Edit category"
        description={`Update “${category.name}”.`}
      />
      <CategoryForm category={category} />
    </div>
  );
}
