import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review the items in your shopping cart.",
};

export default function CartPage() {
  return (
    <Container className="py-10 sm:py-14">
      <h1 className="mb-8 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
        Your cart
      </h1>
      <CartView />
    </Container>
  );
}
