import { cn } from "@/utils/cn";

/**
 * Centers content and applies consistent, responsive horizontal padding and a
 * max width. Use it to wrap page sections so everything lines up.
 */
export function Container({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
