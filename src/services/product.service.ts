import api from "@/services/api";
import { withFallback } from "@/services/with-fallback";
import {
  fallbackFeaturedProducts,
  fallbackProducts,
} from "@/config/fallback-data";
import { slugify } from "@/utils/format";
import type {
  Paginated,
  Product,
  ProductInput,
  ProductListParams,
} from "@/types";

/**
 * Apply the list query (search/category/price) to an in-memory catalog. Used
 * for the fallback/demo path so search and filters still work when the backend
 * is offline; the real API performs the same filtering server-side.
 */
function filterCatalog(
  products: Product[],
  params: ProductListParams = {},
): Product[] {
  const { search, categoryId, minPrice, maxPrice } = params;
  const term = search?.trim().toLowerCase();

  return products.filter((product) => {
    if (
      term &&
      !product.name.toLowerCase().includes(term) &&
      !product.sku.toLowerCase().includes(term)
    ) {
      return false;
    }
    if (categoryId && product.categoryId !== categoryId) return false;
    if (typeof minPrice === "number" && product.price < minPrice) return false;
    if (typeof maxPrice === "number" && product.price > maxPrice) return false;
    return true;
  });
}

/**
 * Product service. Components/hooks should call these functions rather than
 * using `api` directly.
 */
export const productService = {
  /**
   * List products (Tasks 4.1–4.3). Supports free-text search (name/SKU),
   * category and price-range filtering via `GET /products`. Falls back to the
   * demo catalog — filtered locally — when the backend is unavailable.
   */
  list(params: ProductListParams = {}): Promise<Paginated<Product>> {
    return withFallback(
      "product.list",
      async () => {
        const { data } = await api.get<Paginated<Product>>("/products", {
          params,
        });
        return data;
      },
      () => {
        const items = filterCatalog(fallbackProducts, params);
        return {
          items,
          page: params.page ?? 1,
          pageSize: params.pageSize ?? items.length,
          total: items.length,
        };
      },
    );
  },

  /** Fetch a single product by slug (Task 4.4, `GET /products/:slug`). */
  getBySlug(slug: string): Promise<Product | null> {
    return withFallback(
      "product.getBySlug",
      async () => {
        const { data } = await api.get<Product>(`/products/${slug}`);
        return data;
      },
      () => fallbackProducts.find((product) => product.slug === slug) ?? null,
    );
  },

  /** Create a product (Task 9.2, `POST /products`). */
  create(input: ProductInput): Promise<Product> {
    return withFallback(
      "product.create",
      async () => {
        const { data } = await api.post<Product>("/products", input);
        return data;
      },
      () => ({
        id: `p_${Date.now()}`,
        slug: slugify(input.name),
        name: input.name,
        sku: input.sku?.trim() || `EVR-${slugify(input.name).slice(0, 6).toUpperCase()}`,
        description: input.description,
        price: input.price,
        currency: "USD",
        images: input.images,
        categoryId: input.categoryId,
        stock: input.stock,
        featured: input.featured,
        createdAt: new Date().toISOString(),
      }),
    );
  },

  /** Update a product (`PATCH /products/:id`). */
  update(id: string, input: Partial<ProductInput>): Promise<Product> {
    return withFallback(
      "product.update",
      async () => {
        const { data } = await api.patch<Product>(`/products/${id}`, input);
        return data;
      },
      () => {
        const existing = fallbackProducts.find((p) => p.id === id);
        if (!existing) throw new Error(`Product ${id} not found`);
        return {
          ...existing,
          ...input,
          slug: input.name ? slugify(input.name) : existing.slug,
        };
      },
    );
  },

  /** Delete a product (`DELETE /products/:id`). */
  remove(id: string): Promise<void> {
    return withFallback(
      "product.remove",
      async () => {
        await api.delete(`/products/${id}`);
      },
      () => undefined,
    );
  },

  /** Featured products for the homepage (Task 3.3, `GET /products?featured=true`). */
  getFeatured(): Promise<Product[]> {
    return withFallback(
      "product.getFeatured",
      async () => {
        const { data } = await api.get<Paginated<Product> | Product[]>(
          "/products",
          { params: { featured: true } },
        );
        return Array.isArray(data) ? data : data.items;
      },
      fallbackFeaturedProducts,
    );
  },
};
