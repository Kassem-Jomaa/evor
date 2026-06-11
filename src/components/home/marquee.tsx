const PERKS = [
  "Handcrafted leather",
  "Cash on delivery",
  "Free shipping over $100",
  "7-day easy exchange",
  "Designed for everyday elegance",
];

/**
 * Infinite-scrolling perks strip under the hero. Content is duplicated so the
 * CSS keyframe loop (translateX -50%) is seamless; pauses on hover.
 */
export function Marquee() {
  const row = (ariaHidden: boolean) => (
    <ul
      aria-hidden={ariaHidden || undefined}
      className="flex shrink-0 items-center"
    >
      {PERKS.map((perk) => (
        <li
          key={perk}
          className="flex items-center gap-8 whitespace-nowrap pr-8 text-xs font-medium uppercase tracking-[0.25em]"
        >
          {perk}
          <span aria-hidden className="font-serif text-sm">
            ✦
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="overflow-hidden border-b border-border bg-brand py-3.5 text-brand-foreground">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
