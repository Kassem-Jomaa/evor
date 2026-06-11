import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** Section title with an optional "view all" link, used across homepage sections. */
export function SectionHeading({
  title,
  subtitle,
  viewAllHref,
}: {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <h2 className="font-serif text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-brand transition-colors hover:underline"
        >
          View all
          <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  );
}
