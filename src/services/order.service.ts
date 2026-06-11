import api from "@/services/api";
import { withFallback } from "@/services/with-fallback";
import { fallbackOrders } from "@/config/fallback-data";
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  Order,
  OrderStatus,
  Paginated,
} from "@/types";

/** Generate a demo order number (e.g. "EV-1024") for the offline fallback. */
function mockOrderNumber(): string {
  return `EV-${1000 + Math.floor(Math.random() * 9000)}`;
}

/**
 * Order service. Customers place cash-on-delivery orders (Task 6.3); admins
 * list, inspect and progress them (Milestone 10). Falls back to demo data when
 * the backend is unavailable so the flow stays explorable offline.
 */
export const orderService = {
  /** Place a customer order (Task 6.3, `POST /orders`). */
  create(payload: CreateOrderRequest): Promise<CreateOrderResponse> {
    return withFallback(
      "order.create",
      async () => {
        const { data } = await api.post<CreateOrderResponse>(
          "/orders",
          payload,
        );
        return data;
      },
      () => ({ orderNumber: mockOrderNumber() }),
    );
  },

  /** List all orders for the admin dashboard (Task 10.1, `GET /admin/orders`). */
  listAdmin(): Promise<Order[]> {
    return withFallback(
      "order.listAdmin",
      async () => {
        const { data } = await api.get<Paginated<Order> | Order[]>(
          "/admin/orders",
        );
        return Array.isArray(data) ? data : data.items;
      },
      fallbackOrders,
    );
  },

  /** Fetch one order with full detail (Task 10.2, `GET /admin/orders/:id`). */
  getAdmin(id: string): Promise<Order | null> {
    return withFallback(
      "order.getAdmin",
      async () => {
        const { data } = await api.get<Order>(`/admin/orders/${id}`);
        return data;
      },
      () => fallbackOrders.find((order) => order.id === id) ?? null,
    );
  },

  /**
   * Update an order's status (Task 10.3, `PATCH /admin/orders/:id/status`).
   */
  updateStatus(id: string, status: OrderStatus): Promise<Order> {
    return withFallback(
      "order.updateStatus",
      async () => {
        const { data } = await api.patch<Order>(
          `/admin/orders/${id}/status`,
          { status },
        );
        return data;
      },
      () => {
        const existing = fallbackOrders.find((order) => order.id === id);
        const now = new Date().toISOString();
        if (!existing) throw new Error(`Order ${id} not found`);
        return {
          ...existing,
          status,
          timeline: [...(existing.timeline ?? []), { status, at: now }],
        };
      },
    );
  },
};
