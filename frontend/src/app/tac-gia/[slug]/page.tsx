import type { Metadata } from "next";
import Link from "next/link";
import { PoemCard } from "@/components/poem/PoemCard";
import { Badge } from "@/components/ui/Badge";
import { MOCK_AUTHORS, MOCK_POEMS } from "@/lib/mockData";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const author = MOCK_AUTHORS.find((a) => a.slug === slug);
  return { title: author?.name ?? "Tác giả" };
}

export default async function AuthorDetailPage({ params }: Props) {
  const { slug } = await params;
  const author = MOCK_AUTHORS.find((a) => a.slug === slug) ?? MOCK_AUTHORS[0];
  const poems = MOCK_POEMS.filter((p) => p.author.slug === slug || p.author.id === author.id);

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
            {author.name.charAt(0)}
          </div>

          <div className="flex-1">
            <h1
              className="text-headline-lg mb-2"
              style={{ fontFamily: "var(--font-lora)", color: "var(--fg)" }}
            >
              {author.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="default">{author.country}</Badge>
              <Badge variant="default">{author.era}</Badge>
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
            <div className="card p-5">
              <h3 className="text-label-caps mb-4" style={{ color: "var(--color-bamboo-green)" }}>
                DÒNG THỜI GIAN
              </h3>
              <ol className="relative border-l pl-4 space-y-4" style={{ borderColor: "var(--color-border-tan)" }}>
                {TIMELINE.map((t) => (
                  <li key={t.year} className="relative">
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

            {/* Related groups */}
            <div className="card p-5">
              <h3 className="text-label-caps mb-3" style={{ color: "var(--color-bamboo-green)" }}>
                CÁC TÁC GIẢ CÙNG THỜI
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {MOCK_AUTHORS.filter((a) => a.id !== author.id).slice(0, 5).map((a) => (
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

            {/* Search within author */}
            <div className="search-pill flex items-center gap-2 px-4 py-2 mb-6 max-w-sm">
              <svg className="w-4 h-4 shrink-0" style={{ color: "var(--color-muted-gray)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                placeholder={`Tìm trong thơ ${author.name}...`}
                className="bg-transparent outline-none text-sm flex-1"
                style={{ fontFamily: "var(--font-inter)", color: "var(--fg)" }}
              />
            </div>

            {poems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {poems.map((p) => (
                  <PoemCard key={p.id} poem={p} />
                ))}
              </div>
            ) : (
              /* Fallback: show all poems */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {MOCK_POEMS.slice(0, 4).map((p) => (
                  <PoemCard key={p.id} poem={p} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
