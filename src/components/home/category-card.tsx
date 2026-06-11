import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/types";

/**
 * Category card (Task 3.2): image + name. The photo zooms gently on hover and
 * an "Explore" affordance slides into view.
 */
export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative block aspect-[4/5] overflow-hidden rounded-xl bg-muted"
    >
      {category.image && (
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent transition-colors duration-500 group-hover:from-black/80" />

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
        <div>
          <span className="font-serif text-xl font-semibold text-white">
            {category.name}
          </span>
          <span className="mt-1 block max-w-0 overflow-hidden text-xs uppercase tracking-[0.2em] text-white/80 transition-all duration-500 group-hover:max-w-full">
            Explore
          </span>
        </div>
        <span className="flex size-9 translate-y-2 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="size-4" />
        </span>
      </div>
    </Link>
  );
}
