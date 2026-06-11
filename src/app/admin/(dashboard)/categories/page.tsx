import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { CategoryRowActions } from "@/components/admin/category-row-actions";
import { Button } from "@/components/ui/button";
import { categoryService } from "@/services/category.service";
import { cn } from "@/utils/cn";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await categoryService.list();

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Manage your product categories."
        action={
          <Button asChild>
            <Link href="/admin/categories/new">
              <Plus className="size-4" /> New category
            </Link>
          </Button>
        }
      />

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">Image</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-accent/40">
                <td className="px-4 py-3">
                  <div className="relative size-12 overflow-hidden rounded-md border border-border bg-muted">
                    {category.image && (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 font-medium">{category.name}</td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                      category.active !== false
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {category.active !== false ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <CategoryRowActions id={category.id} name={category.name} />
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  No categories yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
