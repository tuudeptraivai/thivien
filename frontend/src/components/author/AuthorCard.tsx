import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import type { Author } from "@/lib/types";

interface AuthorCardProps {
  author: Author;
}

export function AuthorCard({ author }: AuthorCardProps) {
  return (
    <Link href={`/tac-gia/${author.slug}`}>
      <article className="card card-hover p-5 flex gap-4">
        {/* Portrait */}
        <div
          className="w-14 h-14 rounded-full shrink-0 flex items-center justify-center text-white text-lg font-semibold"
          style={{ background: "var(--color-lacquer-red)", fontFamily: "var(--font-lora)" }}
        >
          {author.name.charAt(0)}
        </div>

        <div className="min-w-0">
          <h3
            className="font-semibold text-base mb-0.5 truncate"
            style={{ fontFamily: "var(--font-lora)", color: "var(--fg)" }}
          >
            {author.name}
          </h3>
          <p className="text-sm mb-2 line-clamp-1" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
            {author.era}
          </p>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="default">{author.country}</Badge>
            <Badge variant="green">{author.poem_count} tác phẩm</Badge>
            {author.is_verified && <Badge variant="red">Xác thực ✓</Badge>}
          </div>
        </div>
      </article>
    </Link>
  );
}
