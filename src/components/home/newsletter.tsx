"use client";

import { useState } from "react";
import { Check, Send } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";

/**
 * Newsletter band. Front-end only for now — swap the submit handler for a real
 * subscription endpoint when the backend provides one.
 */
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!email.trim()) return;
    setDone(true);
  }

  return (
    <section className="border-t border-border bg-brand py-16 text-brand-foreground sm:py-20">
      <Container>
        <Reveal className="mx-auto max-w-xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-foreground/70">
            The EVOR circle
          </p>
          <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
            First looks, private sales
          </h2>
          <p className="mt-3 text-sm text-brand-foreground/80">
            Join our list for new arrivals and members-only offers. No noise —
            just the good bags.
          </p>

          {done ? (
            <p className="mx-auto mt-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-medium">
              <Check className="size-4" /> You&apos;re in — welcome to the
              circle.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-8 flex max-w-md gap-2"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="h-12 flex-1 rounded-full border border-white/25 bg-white/10 px-5 text-sm text-brand-foreground outline-none transition-colors placeholder:text-brand-foreground/50 focus-visible:border-white/60 focus-visible:ring-[3px] focus-visible:ring-white/20"
              />
              <button
                type="submit"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-background px-6 text-sm font-semibold text-brand transition-transform hover:scale-[1.03] active:scale-95"
              >
                Join
                <Send className="size-4" />
              </button>
            </form>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
