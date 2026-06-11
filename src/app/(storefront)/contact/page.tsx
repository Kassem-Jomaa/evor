import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/layout/container";
import { ContactForm } from "@/components/contact/contact-form";
import { Reveal } from "@/components/motion/reveal";
import { SOCIAL_ICONS } from "@/components/layout/social-icons";
import { contactInfo, socialLinks } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the EVOR team — we'd love to hear from you.",
};

const DETAILS = [
  { icon: MapPin, label: "Visit us", value: contactInfo.address },
  { icon: Mail, label: "Email", value: contactInfo.email, href: `mailto:${contactInfo.email}` },
  {
    icon: Phone,
    label: "Call us",
    value: contactInfo.phone,
    href: `tel:${contactInfo.phone.replace(/\s+/g, "")}`,
  },
  { icon: Clock, label: "Hours", value: "Mon–Sat, 9:00 — 19:00" },
];

export default function ContactPage() {
  return (
    <Container className="py-12 sm:py-16">
      <Reveal>
        <header className="mb-12 max-w-xl">
          <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand">
            <span className="h-px w-8 bg-brand" aria-hidden />
            Get in touch
          </p>
          <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-5xl">
            We&apos;d love to hear from you
          </h1>
          <p className="mt-3 text-muted-foreground">
            A question about an order, a bag, or a gift? Send us a note — we
            reply within one business day.
          </p>
        </header>
      </Reveal>

      <div className="grid gap-10 lg:grid-cols-[380px_1fr] lg:gap-16">
        {/* Contact details */}
        <div className="space-y-4">
          {DETAILS.map((detail, index) => (
            <Reveal key={detail.label} delay={0.08 * index}>
              <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <detail.icon className="size-4.5" />
                </span>
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {detail.label}
                  </h2>
                  {detail.href ? (
                    <a
                      href={detail.href}
                      className="mt-1 block text-sm font-medium transition-colors hover:text-brand"
                    >
                      {detail.value}
                    </a>
                  ) : (
                    <p className="mt-1 text-sm font-medium">{detail.value}</p>
                  )}
                </div>
              </div>
            </Reveal>
          ))}

          <Reveal delay={0.35}>
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Follow us
              </h2>
              <div className="mt-3 flex items-center gap-1.5">
                {socialLinks.map((social) => {
                  const Icon = SOCIAL_ICONS[social.icon];
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-all hover:scale-110 hover:bg-brand hover:text-brand-foreground"
                    >
                      <Icon className="size-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Form */}
        <Reveal delay={0.15}>
          <ContactForm />
        </Reveal>
      </div>
    </Container>
  );
}
