import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { CheckoutView } from "@/components/checkout/checkout-view";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your cash-on-delivery order.",
};

export default function CheckoutPage() {
  return (
    <Container className="py-10 sm:py-14">
      <h1 className="mb-8 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
        Checkout
      </h1>
      <CheckoutView />
    </Container>
  );
}
