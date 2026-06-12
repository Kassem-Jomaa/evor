/**
 * Seed the live EVOR backend with the demo handbag catalog: 4 categories,
 * 12 products and the homepage hero banner.
 *
 * Usage:
 *   node scripts/seed-backend.mjs <api-url> <admin-email> <admin-password>
 *
 * Existing categories/products (matched by slug) are skipped, so the script is
 * safe to re-run.
 */

const [apiUrl, email, password] = process.argv.slice(2);
if (!apiUrl || !email || !password) {
  console.error(
    "Usage: node scripts/seed-backend.mjs <api-url> <admin-email> <admin-password>",
  );
  process.exit(1);
}

const unsplash = (id, w = 900) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;
const gallery = (id) => [
  unsplash(id),
  `https://images.unsplash.com/${id}?q=80&w=900&auto=format&fit=crop&crop=entropy`,
  `https://images.unsplash.com/${id}?q=80&w=900&auto=format&fit=crop&crop=top`,
];

const CATEGORIES = [
  { name: "Tote Bags", slug: "tote-bags", image: unsplash("photo-1591561954557-26941169b49e", 700) },
  { name: "Shoulder Bags", slug: "shoulder-bags", image: unsplash("photo-1548036328-c9fa89d128fa", 700) },
  { name: "Crossbody Bags", slug: "crossbody-bags", image: unsplash("photo-1566150905458-1bf1fc113f0d", 700) },
  { name: "Clutches", slug: "clutches", image: unsplash("photo-1584917865442-de89df76afd3", 700) },
];

const PRODUCTS = [
  { title: "Leather Everyday Tote", slug: "leather-everyday-tote", sku: "EVR-TOT-001", price: 145, stock: 22, featured: true, category: "tote-bags", photo: "photo-1591561954557-26941169b49e", description: "A full-grain leather tote roomy enough for a laptop and your day's essentials. Soft structured sides and a magnetic top closure." },
  { title: "Canvas Market Tote", slug: "canvas-market-tote", sku: "EVR-TOT-002", price: 68, stock: 50, featured: false, category: "tote-bags", photo: "photo-1553062407-98eeb64c6a62", description: "A sturdy cotton-canvas tote with leather handles — light, foldable and built for everyday errands." },
  { title: "Structured Work Tote", slug: "structured-work-tote", sku: "EVR-TOT-003", price: 189, stock: 14, featured: true, category: "tote-bags", photo: "photo-1548036328-c9fa89d128fa", description: "A polished saffiano-leather work tote with a padded sleeve and gold-tone hardware. Stands upright on its own." },
  { title: "Quilted Chain Shoulder Bag", slug: "quilted-chain-shoulder-bag", sku: "EVR-SHL-001", price: 135, stock: 26, featured: true, category: "shoulder-bags", photo: "photo-1584917865442-de89df76afd3", description: "A quilted leather shoulder bag on a removable chain strap. Timeless, compact and dressed-up ready." },
  { title: "Soft Hobo Shoulder Bag", slug: "soft-hobo-shoulder-bag", sku: "EVR-SHL-002", price: 98, stock: 31, featured: false, category: "shoulder-bags", photo: "photo-1559563458-527698bf5295", description: "A slouchy hobo in buttery pebbled leather that moulds to your shoulder. Roomy single compartment with a zip pocket." },
  { title: "Mini Baguette Shoulder Bag", slug: "mini-baguette-shoulder-bag", sku: "EVR-SHL-003", price: 79, stock: 12, featured: false, category: "shoulder-bags", photo: "photo-1564422170194-896b89110ef8", description: "A neat little baguette that tucks under the arm — just enough room for the essentials, all charm." },
  { title: "Saffiano Crossbody", slug: "saffiano-crossbody", sku: "EVR-CRS-001", price: 112, stock: 28, featured: true, category: "crossbody-bags", photo: "photo-1566150905458-1bf1fc113f0d", description: "A slim saffiano-leather crossbody with an adjustable strap and card slots inside. Hands-free and city-ready." },
  { title: "Camera Crossbody Bag", slug: "camera-crossbody-bag", sku: "EVR-CRS-002", price: 89, stock: 37, featured: false, category: "crossbody-bags", photo: "photo-1547949003-9792a18a2601", description: "A compact camera-style crossbody with a webbing strap and front zip pocket. Casual, practical, everyday." },
  { title: "Bucket Crossbody Bag", slug: "bucket-crossbody-bag", sku: "EVR-CRS-003", price: 124, stock: 18, featured: false, category: "crossbody-bags", photo: "photo-1627123424574-724758594e93", description: "A drawstring bucket bag in smooth leather with a detachable crossbody strap. Carries more than it looks." },
  { title: "Satin Evening Clutch", slug: "satin-evening-clutch", sku: "EVR-CLT-001", price: 64, stock: 44, featured: false, category: "clutches", photo: "photo-1575032617751-6ddec2089882", description: "A sleek satin clutch with a concealed magnetic clasp and a fine drop-in chain for evenings out." },
  { title: "Envelope Leather Clutch", slug: "envelope-leather-clutch", sku: "EVR-CLT-002", price: 72, stock: 33, featured: true, category: "clutches", photo: "photo-1606522754091-a3bbf9ad4cb3", description: "A minimalist envelope clutch in smooth leather — slim enough for a phone, cards and a lipstick." },
  { title: "Beaded Party Clutch", slug: "beaded-party-clutch", sku: "EVR-CLT-003", price: 95, stock: 11, featured: false, category: "clutches", photo: "photo-1594223274512-ad4803739b7c", description: "A hand-beaded clutch that catches the light. A small statement piece for special occasions." },
];

// `buttonLink` omitted — the backend DTO rejects it (frontend defaults to /shop).
const HERO_BANNER = {
  title: "Elegance you can carry",
  subtitle:
    "Handcrafted handbags for women who notice the details — leather totes, shoulder bags and evening clutches, made to be loved for years.",
  image: unsplash("photo-1483985988355-763728e1935b", 1800),
  buttonText: "Shop the collection",
};

async function req(method, path, body, token) {
  const res = await fetch(`${apiUrl}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const json = text ? JSON.parse(text) : null;
  if (!res.ok) {
    throw new Error(`${method} ${path} → ${res.status}: ${text.slice(0, 200)}`);
  }
  return json;
}

const { access_token: token } = await req("POST", "/auth/login", {
  email,
  password,
});
console.log("✓ Logged in");

// Categories (skip existing slugs)
const existingCats = await req("GET", "/categories");
const catIdBySlug = new Map(existingCats.map((c) => [c.slug, c.id]));
for (const cat of CATEGORIES) {
  if (catIdBySlug.has(cat.slug)) {
    console.log(`- Category exists: ${cat.name}`);
    continue;
  }
  const created = await req(
    "POST",
    "/categories",
    { ...cat, isActive: true },
    token,
  );
  catIdBySlug.set(created.slug, created.id);
  console.log(`✓ Category created: ${created.name}`);
}

// Products (skip existing slugs). The list endpoint hides featured products
// unless featured=true is passed, so query both halves.
const [feat, reg] = await Promise.all([
  req("GET", "/products?limit=200&featured=true"),
  req("GET", "/products?limit=200&featured=false"),
]);
const existingSlugs = new Set(
  [...feat.data, ...reg.data].map((p) => p.slug),
);
for (const product of PRODUCTS) {
  if (existingSlugs.has(product.slug)) {
    console.log(`- Product exists: ${product.title}`);
    continue;
  }
  const { category, photo, ...rest } = product;
  await req(
    "POST",
    "/products",
    { ...rest, categoryId: catIdBySlug.get(category), images: gallery(photo) },
    token,
  );
  console.log(`✓ Product created: ${product.title}`);
}

// Hero banner (only if none active yet)
const cms = await req("GET", "/cms");
if ((cms.banners ?? []).some((b) => b.isActive)) {
  console.log("- Hero banner already configured");
} else {
  await req("POST", "/cms/banners", HERO_BANNER, token);
  console.log("✓ Hero banner created");
}

console.log("Done.");
