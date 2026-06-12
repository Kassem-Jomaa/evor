import api from "@/services/api";
import { withFallback } from "@/services/with-fallback";
import { mapCategory, type ApiCategory } from "@/services/mappers";
import { fallbackCategories } from "@/config/fallback-data";
import { slugify } from "@/utils/format";
import type { Category, CategoryInput } from "@/types";

/** Map our CategoryInput to the backend DTO (`isActive`, required `slug`). */
function toApiPayload(input: Partial<CategoryInput>) {
  return {
    ...(input.name != null && { name: input.name, slug: slugify(input.name) }),
    ...(input.image !== undefined && { image: input.image || undefined }),
    ...(input.active !== undefined && { isActive: input.active }),
  };
}

/**
 * Category service. Lists categories for the storefront (Task 3.2) and provides
 * admin create/update/delete operations (Tasks 8.1–8.2). Reads fall back to
 * demo data when the backend is unreachable; writes surface real API errors.
 */
export const categoryService = {
  list(): Promise<Category[]> {
    return withFallback(
      "category.list",
      async () => {
        const { data } = await api.get<ApiCategory[]>("/categories");
        return data.map(mapCategory);
      },
      fallbackCategories,
    );
  },

  /** Create a category (Task 8.2, `POST /categories`). */
  async create(input: CategoryInput): Promise<Category> {
    const { data } = await api.post<ApiCategory>(
      "/categories",
      toApiPayload(input),
    );
    return mapCategory(data);
  },

  /** Update a category (`PATCH /categories/:id`). */
  async update(id: string, input: Partial<CategoryInput>): Promise<Category> {
    const { data } = await api.patch<ApiCategory>(
      `/categories/${id}`,
      toApiPayload(input),
    );
    return mapCategory(data);
  },

  /** Delete a category (`DELETE /categories/:id`). */
  async remove(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};
