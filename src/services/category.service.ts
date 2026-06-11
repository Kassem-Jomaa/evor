import api from "@/services/api";
import { withFallback } from "@/services/with-fallback";
import { fallbackCategories } from "@/config/fallback-data";
import { slugify } from "@/utils/format";
import type { Category, CategoryInput } from "@/types";

/**
 * Category service. Lists categories for the storefront (Task 3.2) and provides
 * admin create/update/delete operations (Tasks 8.1–8.2).
 */
export const categoryService = {
  list(): Promise<Category[]> {
    return withFallback(
      "category.list",
      async () => {
        const { data } = await api.get<Category[]>("/categories");
        return data;
      },
      fallbackCategories,
    );
  },

  /** Create a category (Task 8.2, `POST /categories`). */
  create(input: CategoryInput): Promise<Category> {
    return withFallback(
      "category.create",
      async () => {
        const { data } = await api.post<Category>("/categories", input);
        return data;
      },
      () => ({
        id: `c_${Date.now()}`,
        slug: slugify(input.name),
        name: input.name,
        image: input.image,
        active: input.active,
        productCount: 0,
      }),
    );
  },

  /** Update a category (`PATCH /categories/:id`). */
  update(id: string, input: Partial<CategoryInput>): Promise<Category> {
    return withFallback(
      "category.update",
      async () => {
        const { data } = await api.patch<Category>(`/categories/${id}`, input);
        return data;
      },
      () => {
        const existing = fallbackCategories.find((c) => c.id === id);
        return {
          id,
          slug: existing?.slug ?? slugify(input.name ?? id),
          name: input.name ?? existing?.name ?? "",
          image: input.image ?? existing?.image,
          active: input.active ?? existing?.active ?? true,
        };
      },
    );
  },

  /** Delete a category (`DELETE /categories/:id`). */
  remove(id: string): Promise<void> {
    return withFallback(
      "category.remove",
      async () => {
        await api.delete(`/categories/${id}`);
      },
      () => undefined,
    );
  },
};
