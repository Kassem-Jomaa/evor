import { PageHeader } from "@/components/admin/page-header";
import { CategoryForm } from "@/components/admin/category-form";

export default function NewCategoryPage() {
  return (
    <div>
      <PageHeader
        title="New category"
        description="Add a category to organize your products."
      />
      <CategoryForm />
    </div>
  );
}
