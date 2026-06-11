import { env } from "@/config/env";

/**
 * Central, editable source of site chrome data (navigation, footer, contact,
 * social links). Header and Footer read from here so content can change without
 * touching components — and can later be swapped for a CMS/API response that
 * matches these shapes.
 */

export interface NavLink {
  href: string;
  label: string;
}

export interface FooterSection {
  title: string;
  links: NavLink[];
}

export interface SocialLink {
  href: string;
  label: string;
  icon: "facebook" | "instagram" | "twitter" | "youtube";
}

export interface ContactInfo {
  address: string;
  email: string;
  phone: string;
}

/** Primary navigation (Task 2.1). */
export const mainNav: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/categories", label: "Categories" },
  { href: "/shop", label: "Shop" },
  { href: "/contact", label: "Contact" },
];

/** Footer link columns (Task 2.2 — Quick Links). */
export const footerSections: FooterSection[] = [
  {
    title: "Quick Links",
    links: [
      { href: "/", label: "Home" },
      { href: "/shop", label: "Shop" },
      { href: "/categories", label: "Categories" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Customer Care",
    links: [
      { href: "/shipping", label: "Shipping" },
      { href: "/returns", label: "Returns" },
      { href: "/faq", label: "FAQ" },
      { href: "/track-order", label: "Track Order" },
    ],
  },
];

/** Contact details (Task 2.2 — Contact Info). */
export const contactInfo: ContactInfo = {
  address: "Beirut, Lebanon",
  email: "hello@evor.com",
  phone: "+961 1 234 567",
};

/** Social profiles (Task 2.2 — Social Media). */
export const socialLinks: SocialLink[] = [
  { href: "https://facebook.com", label: "Facebook", icon: "facebook" },
  { href: "https://instagram.com", label: "Instagram", icon: "instagram" },
  { href: "https://twitter.com", label: "Twitter", icon: "twitter" },
  { href: "https://youtube.com", label: "YouTube", icon: "youtube" },
];

/** Short brand blurb used in the footer's "About EVOR" section. */
export const aboutText =
  `${env.appName} brings you a curated collection of refined essentials — ` +
  "crafted with care, delivered with intention.";
