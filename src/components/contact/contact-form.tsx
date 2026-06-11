"use client";

import { useState } from "react";
import { Check, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Contact form. Front-end only for now — wire `handleSubmit` to a real
 * endpoint (e.g. POST /contact) when the backend provides one.
 */
export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in your name, email and message.");
      return;
    }
    setError(null);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-xl border border-border bg-card p-10 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-brand/10 text-brand">
          <Check className="size-6" />
        </span>
        <h2 className="mt-4 font-serif text-xl font-semibold">
          Message sent
        </h2>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          Thank you for reaching out — we&apos;ll get back to you within one
          business day.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5 rounded-xl border border-border bg-card p-6 sm:p-8"
    >
      {error && (
        <p
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="contact-name" className="text-sm font-medium">
            Name <span className="text-destructive">*</span>
          </label>
          <input
            id="contact-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            className={`h-11 ${inputClass}`}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="contact-email" className="text-sm font-medium">
            Email <span className="text-destructive">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className={`h-11 ${inputClass}`}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="contact-message" className="text-sm font-medium">
          Message <span className="text-destructive">*</span>
        </label>
        <textarea
          id="contact-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          placeholder="How can we help?"
          className={`py-2.5 ${inputClass}`}
        />
      </div>

      <Button type="submit" size="lg" className="group rounded-full px-8">
        Send message
        <Send className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Button>
    </form>
  );
}
