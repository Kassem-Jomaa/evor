/**
 * Shared domain types for the EVOR storefront.
 * Feature-specific types can live alongside their feature; put cross-cutting
 * types here.
 */

export interface Product {
  id: string;
  slug: string;
  name: string;
  /** Stock-keeping unit; searchable alongside the product name (Task 4.2). */
  sku: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  categoryId: string;
  stock: number;
  rating?: number;
  featured?: boolean;
  createdAt: string;
}

/** Query parameters accepted by the product list endpoint (Tasks 4.1–4.3). */
export interface ProductListParams {
  /** Free-text search across product name and SKU. */
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  image?: string;
  parentId?: string | null;
  /** Whether the category is visible in the storefront (Task 8.1/8.2). */
  active?: boolean;
  /** Number of products in the category, when provided by the admin API. */
  productCount?: number;
}

/** Admin create/update payload for a category (Task 8.2). */
export interface CategoryInput {
  name: string;
  image?: string;
  active: boolean;
}

/** Admin create/update payload for a product (Task 9.2). */
export interface ProductInput {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  images: string[];
  featured: boolean;
  sku?: string;
}

/**
 * Homepage hero content managed via the CMS (Task 3.1, `GET /cms`).
 * Admin-editable, so every field comes from the API.
 */
export interface HeroContent {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
}

/** Aggregate CMS payload for the homepage. */
export interface CmsContent {
  hero: HeroContent;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

/** A single line sent with a checkout order (Task 6.3). */
export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
}

/** Payload for `POST /orders` — a cash-on-delivery order (Task 6.3). */
export interface CreateOrderRequest {
  customerName: string;
  phone: string;
  address: string;
  city: string;
  /** Optional delivery notes from the customer (Task 6.1). */
  notes?: string;
  items: OrderItem[];
}

/** Response from `POST /orders`. */
export interface CreateOrderResponse {
  orderNumber: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role?: "admin" | "customer";
}

/** Credentials for `POST /auth/login` (Task 7.1). */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Response from `POST /auth/login` — a JWT plus the signed-in user. */
export interface LoginResponse {
  token: string;
  user: User;
}

/** Lifecycle status of a customer order (Task 10.3). */
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

/** A status change in an order's history (Task 10.2 — Order Timeline). */
export interface OrderEvent {
  status: OrderStatus;
  at: string;
  note?: string;
}

/** Full order as seen by the admin dashboard (Tasks 10.1–10.3). */
export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  timeline?: OrderEvent[];
}

/** Standard shape returned by paginated list endpoints. */
export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}
