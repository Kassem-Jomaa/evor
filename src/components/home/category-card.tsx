import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types";

/**
 * Category card (Task 3.2): image + name. Clicking opens the category page.
 */
export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative block aspect-square overflow-hidden rounded-lg bg-muted"
    >
      {category.image && (
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <span className="absolute inset-x-0 bottom-0 p-4 font-serif text-lg font-semibold text-white">
        {category.name}
      </span>
    </Link>
  );
}
