import Link from "next/link";
import { cn } from "@/utils/cn";

/** Four-point sparkle echoing the star above the EVOR mark. */
function Sparkle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 0c.5 5.5 1 6 6.5 6.5C13 7 12.5 7.5 12 13c-.5-5.5-1-6-6.5-6.5C11 6 11.5 5.5 12 0z" />
      <path d="M19 13c.3 3 .5 3.2 3.5 3.5-3 .3-3.2.5-3.5 3.5-.3-3-.5-3.2-3.5-3.5 3-.3 3.2-.5 3.5-3.5z" />
    </svg>
  );
}

/**
 * EVOR brand lockup: the serif wordmark with the sparkle motif.
 * Links home by default; pass `href={undefined}`-style usage via `asLink`.
 */
export function Logo({
  className,
  showSparkle = true,
}: {
  className?: string;
  showSparkle?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="EVOR home"
      className={cn(
        "group inline-flex items-center gap-1.5 text-brand",
        className,
      )}
    >
      {showSparkle && (
        <Sparkle className="size-5 transition-transform group-hover:scale-110" />
      )}
      <span className="font-serif text-2xl font-bold tracking-[0.18em] leading-none">
        EVOR
      </span>
    </Link>
  );
}
