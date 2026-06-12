import type {
  Category,
  HeroContent,
  Order,
  OrderStatus,
  Product,
} from "@/types";

/**
 * Shapes returned by the EVOR backend (https://evor-backend-ggj1.onrender.com)
 * and converters into the frontend's domain types. All differences between the
 * two worlds are handled here so services and components stay clean:
 *
 * - products use `title` (not `name`) and decimal strings for prices
 * - images are `{ url, order }` objects, not plain strings
 * - categories use `isActive` (not `active`)
 * - order statuses are UPPERCASE enums
 * - the homepage hero is a CMS *banner* with `buttonText`/`buttonLink`
 */

// ── API response shapes ─────────────────────────────────────────────────────

export interface ApiProductImage {
  id: string;
  url: string;
  order: number;
}

export interface ApiProduct {
  id: string;
  title: string;
  slug: string;
  description: string;
  sku: string;
  price: string;
  stock: number;
  categoryId: string;
  featured: boolean;
  active: boolean;
  createdAt: string;
  images?: ApiProductImage[];
}

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  isActive: boolean;
  _count?: { products: number };
}

export interface ApiOrderItem {
  productId: string;
  quantity: number;
  price: string;
  product?: { title?: string };
}

export interface ApiOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  city: string | null;
  notes: string | null;
  totalAmount: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  items: ApiOrderItem[];
}

export interface ApiBanner {
  id: string;
  title: string;
  subtitle: string | null;
  image: string;
  buttonText: string | null;
  buttonLink: string | null;
  isActive: boolean;
  order: number;
}

/** Standard paginated list envelope: `{ data, meta }`. */
export interface ApiPaginated<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

// ── Status mapping (frontend lowercase ↔ backend UPPERCASE) ────────────────

const TO_API_STATUS: Record<OrderStatus, string> = {
  pending: "PENDING",
  confirmed: "CONFIRMED",
  preparing: "PREPARING",
  out_for_delivery: "OUT_FOR_DELIVERY",
  delivered: "DELIVERED",
  cancelled: "CANCELLED",
};

export function toApiStatus(status: OrderStatus): string {
  return TO_API_STATUS[status];
}

export function fromApiStatus(status: string): OrderStatus {
  const lower = status.toLowerCase() as OrderStatus;
  return lower in TO_API_STATUS ? lower : "pending";
}

// ── Converters ──────────────────────────────────────────────────────────────

export function mapProduct(api: ApiProduct): Product {
  const images = [...(api.images ?? [])]
    .sort((a, b) => a.order - b.order)
    .map((image) => image.url);

  return {
    id: api.id,
    slug: api.slug,
    name: api.title,
    sku: api.sku,
    description: api.description,
    price: Number(api.price),
    currency: "USD",
    images,
    categoryId: api.categoryId,
    stock: api.stock,
    featured: api.featured,
    createdAt: api.createdAt,
  };
}

export function mapCategory(api: ApiCategory): Category {
  return {
    id: api.id,
    slug: api.slug,
    name: api.name,
    image: api.image ?? undefined,
    active: api.isActive,
    productCount: api._count?.products,
  };
}

export function mapOrder(api: ApiOrder): Order {
  const items = api.items.map((item) => ({
    productId: item.productId,
    title: item.product?.title ?? "Product",
    price: Number(item.price),
    quantity: item.quantity,
  }));
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = Number(api.totalAmount);
  const status = fromApiStatus(api.status);

  return {
    id: api.id,
    orderNumber: api.orderNumber,
    customerName: api.customerName,
    phone: api.phone,
    address: api.address,
    city: api.city ?? "",
    notes: api.notes ?? undefined,
    items,
    subtotal,
    shipping: Math.max(0, total - subtotal),
    total,
    status,
    createdAt: api.createdAt,
    // The backend keeps no status history; surface the latest change only.
    timeline: [{ status, at: api.updatedAt ?? api.createdAt }],
  };
}

export function mapBannerToHero(api: ApiBanner): HeroContent {
  return {
    title: api.title,
    subtitle: api.subtitle ?? "",
    ctaLabel: api.buttonText ?? "Shop the collection",
    ctaHref: api.buttonLink ?? "/shop",
    image: api.image,
  };
}

/**
 * Banner payload for creating/updating the homepage hero (Task 11.1).
 * `buttonLink` is intentionally omitted: the backend DTO rejects it (400) even
 * though it appears in responses — the CTA falls back to "/shop" on read.
 */
export function heroToBannerPayload(hero: HeroContent) {
  return {
    title: hero.title,
    subtitle: hero.subtitle || undefined,
    image: hero.image,
    buttonText: hero.ctaLabel || undefined,
  };
}
