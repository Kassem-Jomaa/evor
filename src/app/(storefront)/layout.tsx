import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

/**
 * Storefront chrome — the customer-facing header and footer wrap every page in
 * this route group. The admin section lives outside it and provides its own
 * dashboard chrome instead.
 */
export default function StorefrontLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
