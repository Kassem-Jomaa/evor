import type { CmsContent, Category, Order, Product } from "@/types";

/**
 * Seed/demo content rendered when the backend API is unavailable (e.g. local
 * dev without the API running, or build-time prerender). Services fall back to
 * these so pages are never empty; real data takes over once the API responds.
 *
 * The storefront currently sells bags only — categories and products below are
 * all bag types.
 */

export const fallbackCms: CmsContent = {
  hero: {
    title: "Carry it well — bags made to last",
    subtitle:
      "Discover the EVOR edit of leather totes, shoulder bags and clutches, crafted to go everywhere you do.",
    ctaLabel: "Shop bags",
    ctaHref: "/shop",
    image: "https://picsum.photos/seed/evor-bags-hero/1600/900",
  },
};

export const fallbackCategories: Category[] = [
  {
    id: "c1",
    slug: "tote-bags",
    name: "Tote Bags",
    image: "https://picsum.photos/seed/evor-totes/600/600",
    active: true,
  },
  {
    id: "c2",
    slug: "shoulder-bags",
    name: "Shoulder Bags",
    image: "https://picsum.photos/seed/evor-shoulder/600/600",
    active: true,
  },
  {
    id: "c3",
    slug: "crossbody-bags",
    name: "Crossbody Bags",
    image: "https://picsum.photos/seed/evor-crossbody/600/600",
    active: true,
  },
  {
    id: "c4",
    slug: "clutches",
    name: "Clutches",
    image: "https://picsum.photos/seed/evor-clutches/600/600",
    active: true,
  },
];

/** Build the 3-image gallery used by demo products. */
function gallery(seed: string): string[] {
  return [
    `https://picsum.photos/seed/${seed}-a/800/800`,
    `https://picsum.photos/seed/${seed}-b/800/800`,
    `https://picsum.photos/seed/${seed}-c/800/800`,
  ];
}

/**
 * Full demo catalog of bags spanning every category and a range of prices, so
 * the listing, search and filter features (Tasks 4.1–4.3) have realistic data
 * to work against when the backend is offline.
 */
export const fallbackProducts: Product[] = [
  // ── Tote Bags ──────────────────────────────────────────────────────────
  {
    id: "p1",
    slug: "leather-everyday-tote",
    name: "Leather Everyday Tote",
    sku: "EVR-TOT-001",
    description:
      "A full-grain leather tote roomy enough for a laptop and your day's essentials. Soft structured sides and a magnetic top closure.",
    price: 145,
    currency: "USD",
    images: gallery("evor-bag1"),
    categoryId: "c1",
    stock: 22,
    rating: 4.8,
    featured: true,
    createdAt: "2026-01-12T00:00:00.000Z",
  },
  {
    id: "p2",
    slug: "canvas-market-tote",
    name: "Canvas Market Tote",
    sku: "EVR-TOT-002",
    description:
      "A sturdy cotton-canvas tote with leather handles — light, foldable and built for everyday errands.",
    price: 68,
    currency: "USD",
    images: gallery("evor-bag2"),
    categoryId: "c1",
    stock: 50,
    rating: 4.5,
    createdAt: "2026-02-04T00:00:00.000Z",
  },
  {
    id: "p3",
    slug: "structured-work-tote",
    name: "Structured Work Tote",
    sku: "EVR-TOT-003",
    description:
      "A polished saffiano-leather work tote with a padded sleeve and gold-tone hardware. Stands upright on its own.",
    price: 189,
    currency: "USD",
    images: gallery("evor-bag3"),
    categoryId: "c1",
    stock: 14,
    rating: 4.9,
    featured: true,
    createdAt: "2026-03-18T00:00:00.000Z",
  },

  // ── Shoulder Bags ──────────────────────────────────────────────────────
  {
    id: "p4",
    slug: "quilted-chain-shoulder-bag",
    name: "Quilted Chain Shoulder Bag",
    sku: "EVR-SHL-001",
    description:
      "A quilted leather shoulder bag on a removable chain strap. Timeless, compact and dressed-up ready.",
    price: 135,
    currency: "USD",
    images: gallery("evor-bag4"),
    categoryId: "c2",
    stock: 26,
    rating: 4.7,
    featured: true,
    createdAt: "2026-02-20T00:00:00.000Z",
  },
  {
    id: "p5",
    slug: "soft-hobo-shoulder-bag",
    name: "Soft Hobo Shoulder Bag",
    sku: "EVR-SHL-002",
    description:
      "A slouchy hobo in buttery pebbled leather that moulds to your shoulder. Roomy single compartment with a zip pocket.",
    price: 98,
    currency: "USD",
    images: gallery("evor-bag5"),
    categoryId: "c2",
    stock: 31,
    rating: 4.4,
    createdAt: "2026-01-30T00:00:00.000Z",
  },
  {
    id: "p6",
    slug: "mini-baguette-shoulder-bag",
    name: "Mini Baguette Shoulder Bag",
    sku: "EVR-SHL-003",
    description:
      "A neat little baguette that tucks under the arm — just enough room for the essentials, all charm.",
    price: 79,
    currency: "USD",
    images: gallery("evor-bag6"),
    categoryId: "c2",
    stock: 0,
    rating: 4.6,
    createdAt: "2026-04-08T00:00:00.000Z",
  },

  // ── Crossbody Bags ─────────────────────────────────────────────────────
  {
    id: "p7",
    slug: "saffiano-crossbody",
    name: "Saffiano Crossbody",
    sku: "EVR-CRS-001",
    description:
      "A slim saffiano-leather crossbody with an adjustable strap and card slots inside. Hands-free and city-ready.",
    price: 112,
    currency: "USD",
    images: gallery("evor-bag7"),
    categoryId: "c3",
    stock: 28,
    rating: 4.7,
    featured: true,
    createdAt: "2026-03-02T00:00:00.000Z",
  },
  {
    id: "p8",
    slug: "camera-crossbody-bag",
    name: "Camera Crossbody Bag",
    sku: "EVR-CRS-002",
    description:
      "A compact camera-style crossbody with a webbing strap and front zip pocket. Casual, practical, everyday.",
    price: 89,
    currency: "USD",
    images: gallery("evor-bag8"),
    categoryId: "c3",
    stock: 37,
    rating: 4.5,
    createdAt: "2026-02-14T00:00:00.000Z",
  },
  {
    id: "p9",
    slug: "bucket-crossbody-bag",
    name: "Bucket Crossbody Bag",
    sku: "EVR-CRS-003",
    description:
      "A drawstring bucket bag in smooth leather with a detachable crossbody strap. Carries more than it looks.",
    price: 124,
    currency: "USD",
    images: gallery("evor-bag9"),
    categoryId: "c3",
    stock: 18,
    rating: 4.6,
    createdAt: "2026-04-22T00:00:00.000Z",
  },

  // ── Clutches ───────────────────────────────────────────────────────────
  {
    id: "p10",
    slug: "satin-evening-clutch",
    name: "Satin Evening Clutch",
    sku: "EVR-CLT-001",
    description:
      "A sleek satin clutch with a concealed magnetic clasp and a fine drop-in chain for evenings out.",
    price: 64,
    currency: "USD",
    images: gallery("evor-bag10"),
    categoryId: "c4",
    stock: 44,
    rating: 4.5,
    createdAt: "2026-03-28T00:00:00.000Z",
  },
  {
    id: "p11",
    slug: "envelope-leather-clutch",
    name: "Envelope Leather Clutch",
    sku: "EVR-CLT-002",
    description:
      "A minimalist envelope clutch in smooth leather — slim enough for a phone, cards and a lipstick.",
    price: 72,
    currency: "USD",
    images: gallery("evor-bag11"),
    categoryId: "c4",
    stock: 33,
    rating: 4.7,
    featured: true,
    createdAt: "2026-01-18T00:00:00.000Z",
  },
  {
    id: "p12",
    slug: "beaded-party-clutch",
    name: "Beaded Party Clutch",
    sku: "EVR-CLT-003",
    description:
      "A hand-beaded clutch that catches the light. A small statement piece for special occasions.",
    price: 95,
    currency: "USD",
    images: gallery("evor-bag12"),
    categoryId: "c4",
    stock: 11,
    rating: 4.9,
    createdAt: "2026-04-26T00:00:00.000Z",
  },
];

/** Featured subset surfaced on the homepage (Task 3.3). */
export const fallbackFeaturedProducts: Product[] = fallbackProducts.filter(
  (product) => product.featured,
);

/**
 * Demo orders for the admin dashboard (Milestone 10) when the backend is
 * offline. Covers a spread of statuses so the orders table and status controls
 * have something realistic to render.
 */
export const fallbackOrders: Order[] = [
  {
    id: "o1",
    orderNumber: "EV-1024",
    customerName: "Lina Haddad",
    phone: "+961 70 123 456",
    address: "12 Rue Gouraud, Gemmayzeh",
    city: "Beirut",
    notes: "Please call on arrival.",
    items: [
      {
        productId: "p1",
        title: "Leather Everyday Tote",
        price: 145,
        quantity: 1,
      },
      {
        productId: "p10",
        title: "Satin Evening Clutch",
        price: 64,
        quantity: 1,
      },
    ],
    subtotal: 209,
    shipping: 0,
    total: 209,
    status: "pending",
    createdAt: "2026-06-03T09:15:00.000Z",
    timeline: [{ status: "pending", at: "2026-06-03T09:15:00.000Z" }],
  },
  {
    id: "o2",
    orderNumber: "EV-1025",
    customerName: "Karim Nassar",
    phone: "+961 71 987 654",
    address: "5 Hamra Street",
    city: "Beirut",
    items: [
      {
        productId: "p3",
        title: "Structured Work Tote",
        price: 189,
        quantity: 1,
      },
    ],
    subtotal: 189,
    shipping: 0,
    total: 189,
    status: "out_for_delivery",
    createdAt: "2026-06-02T14:40:00.000Z",
    timeline: [
      { status: "pending", at: "2026-06-02T14:40:00.000Z" },
      { status: "confirmed", at: "2026-06-02T15:10:00.000Z" },
      { status: "preparing", at: "2026-06-02T16:00:00.000Z" },
      { status: "out_for_delivery", at: "2026-06-03T08:30:00.000Z" },
    ],
  },
  {
    id: "o3",
    orderNumber: "EV-1026",
    customerName: "Maya Khalil",
    phone: "+961 76 222 333",
    address: "88 Achrafieh Boulevard",
    city: "Beirut",
    items: [
      {
        productId: "p7",
        title: "Saffiano Crossbody",
        price: 112,
        quantity: 1,
      },
      {
        productId: "p6",
        title: "Mini Baguette Shoulder Bag",
        price: 79,
        quantity: 1,
      },
    ],
    subtotal: 191,
    shipping: 0,
    total: 191,
    status: "delivered",
    createdAt: "2026-05-29T11:05:00.000Z",
    timeline: [
      { status: "pending", at: "2026-05-29T11:05:00.000Z" },
      { status: "confirmed", at: "2026-05-29T11:30:00.000Z" },
      { status: "preparing", at: "2026-05-29T13:00:00.000Z" },
      { status: "out_for_delivery", at: "2026-05-30T09:00:00.000Z" },
      { status: "delivered", at: "2026-05-30T15:20:00.000Z" },
    ],
  },
  {
    id: "o4",
    orderNumber: "EV-1027",
    customerName: "Omar Sleiman",
    phone: "+961 78 444 555",
    address: "3 Jounieh Coastal Road",
    city: "Jounieh",
    items: [
      {
        productId: "p10",
        title: "Satin Evening Clutch",
        price: 64,
        quantity: 1,
      },
    ],
    subtotal: 64,
    shipping: 8,
    total: 72,
    status: "cancelled",
    createdAt: "2026-05-27T17:50:00.000Z",
    timeline: [
      { status: "pending", at: "2026-05-27T17:50:00.000Z" },
      {
        status: "cancelled",
        at: "2026-05-28T08:10:00.000Z",
        note: "Customer request",
      },
    ],
  },
];
