import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { formatNumber } from "@/lib/utils";
import type { Poem } from "@/lib/types";

interface PoemCardProps {
  poem: Poem;
  showExcerpt?: boolean;
}

export function PoemCard({ poem, showExcerpt = true }: PoemCardProps) {
  return (
    <Link href={`/tho/${poem.slug}`} className="block">
      <article className="card card-hover p-5 h-full">
        <h3
          className="poem-card-title text-base mb-1 line-clamp-2"
          style={{ fontFamily: "var(--font-lora)", fontWeight: 600 }}
        >
          {poem.title}
        </h3>

        <p className="text-sm mb-3" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
          <span style={{ color: "var(--color-lacquer-red)" }}>
            {poem.author.name}
          </span>
          {" · "}{poem.category.name}
        </p>

        {showExcerpt && poem.excerpt && (
          <p
            className="text-sm leading-relaxed line-clamp-3 mb-4"
            style={{
              fontFamily: "var(--font-lora)",
              fontStyle: "italic",
              color: "var(--color-on-surface-variant)",
            }}
          >
            {poem.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto">
          <Badge variant="default">{poem.category.name}</Badge>
          <span
            className="flex items-center gap-1 text-xs"
            style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {formatNumber(poem.view_count)}
          </span>
        </div>
      </article>
    </Link>
  );
}
