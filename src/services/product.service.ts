import api from "@/services/api";
import { withFallback } from "@/services/with-fallback";
import {
  mapProduct,
  type ApiPaginated,
  type ApiProduct,
} from "@/services/mappers";
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

/** UUID test — the backend fetches products by id, while our URLs use slugs. */
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Apply the list query (search/category/price) to an in-memory catalog. Used
 * for the fallback/demo path so search and filters still work when the backend
 * is offline; the real API performs name/category filtering server-side.
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
 * Map our ProductInput to the backend's product DTO. `slug` and `sku` are only
 * accepted by the **create** endpoint; the update DTO whitelist rejects them
 * with a 400 ("property slug should not exist"), so they're omitted on update.
 */
function toApiPayload(input: ProductInput, { create }: { create: boolean }) {
  const payload = {
    title: input.name,
    // Backend requires a description; fall back to the title.
    description: input.description.trim() || input.name,
    price: input.price,
    stock: input.stock,
    categoryId: input.categoryId,
    featured: input.featured,
    images: input.images,
  };
  if (!create) return payload;
  return {
    ...payload,
    slug: slugify(input.name),
    sku:
      input.sku?.trim() ||
      `EVR-${slugify(input.name).slice(0, 12).toUpperCase()}-${Date.now() % 1000}`,
  };
}

/**
 * Fetch every product matching the query. The backend's `GET /products`
 * wrongly treats a *missing* `featured` param as `featured=false` and hides
 * featured products, so we query both halves in parallel and merge. (Still
 * correct if the backend fixes the bug, since each half stays filtered.)
 */
async function fetchAllProducts(params: {
  search?: string;
  categoryId?: string;
  limit: number;
}): Promise<{ items: Product[]; total: number }> {
  const query = {
    search: params.search || undefined,
    categoryId: params.categoryId || undefined,
    limit: params.limit,
  };
  const [featured, regular] = await Promise.all([
    api.get<ApiPaginated<ApiProduct>>("/products", {
      params: { ...query, featured: true },
    }),
    api.get<ApiPaginated<ApiProduct>>("/products", {
      params: { ...query, featured: false },
    }),
  ]);
  const items = [...featured.data.data, ...regular.data.data].map(mapProduct);
  return { items, total: featured.data.meta.total + regular.data.meta.total };
}

/**
 * Product service. Components/hooks should call these functions rather than
 * using `api` directly. Reads fall back to the demo catalog when the backend
 * is unreachable; writes surface real API errors.
 */
export const productService = {
  /**
   * List products (Tasks 4.1–4.3) via `GET /products`. The backend returns
   * `{ data, meta }` with `title`/string prices; mapping happens here. Price
   * range filtering is client-side only (the API has no price params).
   */
  list(params: ProductListParams = {}): Promise<Paginated<Product>> {
    return withFallback(
      "product.list",
      async () => {
        const limit = params.pageSize ?? 100;
        const { items: all, total } = await fetchAllProducts({
          search: params.search,
          categoryId: params.categoryId,
          limit,
        });
        let items = all;
        // The API has no price filters; apply them locally when requested.
        if (params.minPrice != null || params.maxPrice != null) {
          items = filterCatalog(items, {
            minPrice: params.minPrice,
            maxPrice: params.maxPrice,
          });
        }
        return {
          items,
          page: params.page ?? 1,
          pageSize: limit,
          total,
        };
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

  /**
   * Fetch a single product (Task 4.4). Our URLs use slugs but the backend only
   * resolves UUIDs, so non-UUID lookups go through the list and match locally.
   */
  getBySlug(slug: string): Promise<Product | null> {
    return withFallback(
      "product.getBySlug",
      async () => {
        if (UUID_RE.test(slug)) {
          const { data } = await api.get<ApiProduct>(`/products/${slug}`);
          return mapProduct(data);
        }
        const { items } = await fetchAllProducts({ limit: 100 });
        return items.find((product) => product.slug === slug) ?? null;
      },
      () => fallbackProducts.find((product) => product.slug === slug) ?? null,
    );
  },

  /** Create a product (Task 9.2, `POST /products`). Errors surface to the form. */
  async create(input: ProductInput): Promise<Product> {
    const { data } = await api.post<ApiProduct>(
      "/products",
      toApiPayload(input, { create: true }),
    );
    return mapProduct(data);
  },

  /** Update a product (`PATCH /products/:id`). */
  async update(id: string, input: ProductInput): Promise<Product> {
    const { data } = await api.patch<ApiProduct>(
      `/products/${id}`,
      toApiPayload(input, { create: false }),
    );
    return mapProduct(data);
  },

  /** Delete a product (`DELETE /products/:id`). */
  async remove(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },

  /** Featured products for the homepage (Task 3.3, `GET /products?featured=true`). */
  getFeatured(): Promise<Product[]> {
    return withFallback(
      "product.getFeatured",
      async () => {
        const { data } = await api.get<ApiPaginated<ApiProduct>>("/products", {
          params: { featured: true, limit: 8 },
        });
        return data.data.map(mapProduct);
      },
      fallbackFeaturedProducts,
    );
  },
};
