import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { ProductRowActions } from "@/components/admin/product-row-actions";
import { Button } from "@/components/ui/button";
import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/utils/cn";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const [catalog, categories] = await Promise.all([
    productService.list(),
    categoryService.list(),
  ]);
  const categoryName = new Map(categories.map((c) => [c.id, c.name]));

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage your product catalog."
        action={
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="size-4" /> New product
            </Link>
          </Button>
        }
      />

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">Image</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {catalog.items.map((product) => (
              <tr key={product.id} className="hover:bg-accent/40">
                <td className="px-4 py-3">
                  <div className="relative size-12 overflow-hidden rounded-md border border-border bg-muted">
                    {product.images[0] && (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium">{product.name}</span>
                  {product.featured && (
                    <span className="ml-2 rounded bg-brand/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-brand">
                      Featured
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 tabular-nums">
                  {formatCurrency(product.price, product.currency)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "tabular-nums",
                      product.stock === 0 && "text-destructive",
                    )}
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {categoryName.get(product.categoryId) ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <ProductRowActions id={product.id} name={product.name} />
                </td>
              </tr>
            ))}
            {catalog.items.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  No products yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
