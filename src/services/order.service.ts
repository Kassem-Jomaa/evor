import api from "@/services/api";
import { withOfflineFallback } from "@/services/with-fallback";
import {
  mapOrder,
  toApiStatus,
  type ApiOrder,
  type ApiPaginated,
} from "@/services/mappers";
import { fallbackOrders } from "@/config/fallback-data";
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  Order,
  OrderStatus,
} from "@/types";

/** Generate a demo order number for the offline fallback. */
function mockOrderNumber(): string {
  return `EV-${1000 + Math.floor(Math.random() * 9000)}`;
}

/**
 * Order service. Customers place cash-on-delivery orders (Task 6.3); admins
 * list, inspect and progress them via the JWT-protected `/orders` endpoints
 * (Milestone 10). Admin reads fall back to demo data offline; status writes
 * surface real API errors.
 */
export const orderService = {
  /** Place a customer order (Task 6.3, `POST /orders`). */
  create(payload: CreateOrderRequest): Promise<CreateOrderResponse> {
    return withOfflineFallback(
      "order.create",
      async () => {
        const { data } = await api.post<ApiOrder>("/orders", payload);
        return { orderNumber: data.orderNumber };
      },
      () => ({ orderNumber: mockOrderNumber() }),
    );
  },

  /**
   * List all orders for the admin dashboard (Task 10.1, `GET /orders`).
   * Falls back to demo data only when the backend is unreachable — auth
   * errors (401) surface so the UI never silently shows demo orders.
   */
  listAdmin(): Promise<Order[]> {
    return withOfflineFallback(
      "order.listAdmin",
      async () => {
        const { data } = await api.get<ApiPaginated<ApiOrder> | ApiOrder[]>(
          "/orders",
          { params: { limit: 100 } },
        );
        const orders = Array.isArray(data) ? data : data.data;
        return orders.map(mapOrder);
      },
      fallbackOrders,
    );
  },

  /** Fetch one order with full detail (Task 10.2, `GET /orders/:id`). */
  getAdmin(id: string): Promise<Order | null> {
    return withOfflineFallback(
      "order.getAdmin",
      async () => {
        const { data } = await api.get<ApiOrder>(`/orders/${id}`);
        return mapOrder(data);
      },
      () => fallbackOrders.find((order) => order.id === id) ?? null,
    );
  },

  /**
   * Update an order's status (Task 10.3, `PATCH /orders/:id/status`).
   * The backend uses UPPERCASE enum values; mapping happens here.
   */
  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const { data } = await api.patch<ApiOrder>(`/orders/${id}/status`, {
      status: toApiStatus(status),
    });
    return mapOrder(data);
  },
};
