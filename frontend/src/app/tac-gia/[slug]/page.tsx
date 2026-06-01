import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PoemCard } from "@/components/poem/PoemCard";
import { Badge } from "@/components/ui/Badge";
import {
  getAuthorDetail,
  getAuthorPoems,
  getRelatedAuthors,
} from "@/lib/server-api";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorDetail(slug);
  return { title: author?.name ?? "Tác giả" };
}

export default async function AuthorDetailPage({ params }: Props) {
  const { slug } = await params;

  const [author, poemsResult] = await Promise.all([
    getAuthorDetail(slug),
    // poems fetched after we know authorId — handled below
    Promise.resolve(null),
  ]);

  if (!author) notFound();

  const [{ data: poems }, relatedAuthors] = await Promise.all([
    getAuthorPoems(author.id, 1, 8),
    getRelatedAuthors(author.era_id, author.id, 5),
  ]);

  const TIMELINE = [
    author.birth_year && { year: author.birth_year, event: "Năm sinh" },
    { year: "—", event: "Bắt đầu sáng tác" },
    author.death_year && { year: author.death_year, event: "Năm mất" },
  ].filter(Boolean) as { year: string; event: string }[];

  return (
    <div style={{ background: "var(--color-background-parchment)", minHeight: "100vh" }}>
      {/* ── Author banner ── */}
      <div
        className="relative py-14 px-6"
        style={{
          background: "linear-gradient(135deg, var(--color-paper-pure) 0%, var(--color-surface-ivory) 100%)",
          borderBottom: "1px solid var(--color-border-tan)",
        }}
      >
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row gap-6 items-start">
          {/* Portrait */}
          <div
            className="w-20 h-20 rounded-full shrink-0 flex items-center justify-center text-3xl font-bold text-white"
            style={{ background: "var(--color-lacquer-red)", fontFamily: "var(--font-lora)" }}
          >
            {author.portrait_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={author.portrait_url} alt={author.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              author.name.charAt(0)
            )}
          </div>

          <div className="flex-1">
            <h1
              className="text-headline-lg mb-2"
              style={{ fontFamily: "var(--font-lora)", color: "var(--fg)" }}
            >
              {author.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {author.country && <Badge variant="default">{author.country}</Badge>}
              {author.era && <Badge variant="default">{author.era}</Badge>}
              <Badge variant="green">{author.poem_count} tác phẩm</Badge>
              {author.is_verified && <Badge variant="red">✓ Xác thực</Badge>}
              {author.birth_year && (
                <span className="text-sm" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
                  {author.birth_year}{author.death_year ? `–${author.death_year}` : ""}
                </span>
              )}
            </div>

            {author.biography && (
              <p
                className="max-w-2xl leading-relaxed"
                style={{
                  fontFamily: "var(--font-lora)",
                  color: "var(--color-on-surface-variant)",
                  fontSize: 16,
                  lineHeight: 1.8,
                }}
              >
                {author.biography}
              </p>
            )}
          </div>
        </div>

        {/* Decorative ink mark */}
        <div
          className="absolute right-12 top-8 text-7xl opacity-[0.04] pointer-events-none select-none"
          style={{ fontFamily: "var(--font-cjk)", color: "var(--color-lacquer-red)" }}
        >
          詩
        </div>
      </div>

      {/* ── Main 2-col layout ── */}
      <div className="max-w-[1280px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">

          {/* LEFT sidebar */}
          <aside className="space-y-6">
            {/* Timeline */}
            {TIMELINE.length > 0 && (
              <div className="card p-5">
                <h3 className="text-label-caps mb-4" style={{ color: "var(--color-bamboo-green)" }}>
                  DÒNG THỜI GIAN
                </h3>
                <ol className="relative border-l pl-4 space-y-4" style={{ borderColor: "var(--color-border-tan)" }}>
                  {TIMELINE.map((t) => (
                    <li key={t.year + t.event} className="relative">
                      <span
                        className="absolute -left-[1.15rem] top-1 w-3 h-3 rounded-full border-2"
                        style={{ background: "var(--card-bg)", borderColor: "var(--color-lacquer-red)" }}
                      />
                      <p className="text-xs font-semibold" style={{ color: "var(--color-lacquer-red)", fontFamily: "var(--font-inter)" }}>
                        {t.year}
                      </p>
                      <p className="text-sm" style={{ color: "var(--fg)", fontFamily: "var(--font-inter)" }}>
                        {t.event}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Related authors */}
            {relatedAuthors.length > 0 && (
              <div className="card p-5">
                <h3 className="text-label-caps mb-3" style={{ color: "var(--color-bamboo-green)" }}>
                  CÁC TÁC GIẢ CÙNG THỜI
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {relatedAuthors.map((a) => (
                    <Link
                      key={a.id}
                      href={`/tac-gia/${a.slug}`}
                      className="text-xs px-2.5 py-1 rounded-full border transition-colors hover:border-[var(--color-lacquer-red)] hover:text-[var(--color-lacquer-red)]"
                      style={{ borderColor: "var(--color-border-tan)", color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}
                    >
                      {a.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* RIGHT content */}
          <section>
            {/* Tabs */}
            <div className="flex gap-1 border-b mb-6" style={{ borderColor: "var(--color-border-tan)" }}>
              {["Tác phẩm tiêu biểu", "Tất cả (A-Z)", "Bình luận"].map((t, i) => (
                <span
                  key={t}
                  className="px-4 py-2.5 text-sm font-medium"
                  style={{
                    fontFamily: "var(--font-inter)",
                    color: i === 0 ? "var(--color-lacquer-red)" : "var(--color-muted-gray)",
                    borderBottom: i === 0 ? "2px solid var(--color-lacquer-red)" : "2px solid transparent",
                    cursor: "pointer",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>

            {poems.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {poems.map((p) => (
                    <PoemCard key={p.id} poem={p} />
                  ))}
                </div>
                <div className="text-center mt-6">
                  <Link
                    href={`/tho?author_id=${author.id}`}
                    className="btn-primary px-6 py-2.5 text-sm inline-block"
                  >
                    Xem tất cả {author.poem_count} bài →
                  </Link>
                </div>
              </>
            ) : (
              <p className="text-center py-16" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-lora)" }}>
                Chưa có bài thơ nào được thêm vào.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
