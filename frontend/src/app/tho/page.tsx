import type { Metadata } from "next";
import Link from "next/link";
import { PoemCard } from "@/components/poem/PoemCard";
import { getPoemsList, getPoemCategories } from "@/lib/server-api";

export const metadata: Metadata = { title: "Thơ – Thi Uyển" };

const SORT_LABELS: Record<string, string> = {
  newest: "Mới nhất",
  views: "Xem nhiều",
  abc: "A–Z",
};

export default async function PoemListPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string; page?: string }>;
}) {
  const { category, sort = "newest", page = "1" } = await searchParams;
  const currentPage = Math.max(1, parseInt(page, 10) || 1);

  const categories = await getPoemCategories();

  let categoryId: number | undefined;
  if (category && categories.length > 0) {
    const found = categories.find((c) => c.slug === category);
    if (found?.id) categoryId = found.id;
  }

  const { data: poems, meta } = await getPoemsList({
    category_id: categoryId,
    sort,
    page: currentPage,
    limit: 18,
  });

  function buildHref(overrides: Record<string, string | undefined>) {
    const p: Record<string, string> = {};
    if (category) p.category = category;
    if (sort !== "newest") p.sort = sort;
    if (currentPage > 1) p.page = String(currentPage);
    Object.assign(p, overrides);
    Object.keys(p).forEach((k) => p[k] === undefined && delete p[k]);
    const qs = new URLSearchParams(p).toString();
    return `/tho${qs ? `?${qs}` : ""}`;
  }

  return (
    <div style={{ background: "var(--color-background-parchment)", minHeight: "100vh" }}>
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        <p className="text-label-caps mb-2" style={{ color: "var(--color-bamboo-green)" }}>
          THƯ VIỆN
        </p>
        <h1
          className="text-headline-lg mb-8"
          style={{ fontFamily: "var(--font-lora)", color: "var(--fg)" }}
        >
          Thể loại & Chuyên mục Thơ
        </h1>

        {/* Category filter chips */}
        {categories.length > 0 && (
          <section className="mb-10">
            <h2 className="text-label-caps mb-4" style={{ color: "var(--color-muted-gray)" }}>
              THỂ LOẠI
            </h2>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/tho"
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  !category
                    ? "border-[var(--color-lacquer-red)] text-[var(--color-lacquer-red)]"
                    : "border-[var(--color-border-tan)] text-[var(--color-muted-gray)] hover:border-[var(--color-lacquer-red)] hover:text-[var(--color-lacquer-red)]"
                }`}
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Tất cả
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={buildHref({ category: cat.slug, page: undefined })}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    category === cat.slug
                      ? "border-[var(--color-lacquer-red)] text-[var(--color-lacquer-red)]"
                      : "border-[var(--color-border-tan)] text-[var(--color-muted-gray)] hover:border-[var(--color-lacquer-red)] hover:text-[var(--color-lacquer-red)]"
                  }`}
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {cat.name}
                  {cat.poem_count ? ` (${cat.poem_count.toLocaleString()})` : ""}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Sort bar */}
        <div className="flex items-center gap-3 mb-6">
          <span
            className="text-xs font-medium"
            style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}
          >
            Sắp xếp:
          </span>
          {(["newest", "views", "abc"] as const).map((s) => (
            <Link
              key={s}
              href={buildHref({ sort: s, page: undefined })}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                sort === s
                  ? "border-[var(--color-bamboo-green)] text-[var(--color-bamboo-green)]"
                  : "border-[var(--color-border-tan)] text-[var(--color-muted-gray)] hover:border-[var(--color-bamboo-green)]"
              }`}
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {SORT_LABELS[s]}
            </Link>
          ))}
        </div>

        {/* Poem grid */}
        <section>
          <h2 className="text-label-caps mb-4" style={{ color: "var(--color-muted-gray)" }}>
            {meta.total_records > 0
              ? `${meta.total_records.toLocaleString()} TÁC PHẨM`
              : "TÁC PHẨM"}
          </h2>

          {poems.length === 0 ? (
            <div
              className="text-center py-16"
              style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}
            >
              Chưa có bài thơ nào trong mục này.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {poems.map((poem) => (
                <PoemCard key={poem.id} poem={poem} />
              ))}
            </div>
          )}
        </section>

        {/* Pagination */}
        {meta.total_pages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            {currentPage > 1 && (
              <Link
                href={buildHref({ page: String(currentPage - 1) })}
                className="px-4 py-2 rounded-lg border text-sm transition-colors hover:border-[var(--color-lacquer-red)]"
                style={{
                  borderColor: "var(--color-border-tan)",
                  fontFamily: "var(--font-inter)",
                  color: "var(--fg)",
                }}
              >
                ← Trước
              </Link>
            )}
            <span
              className="px-4 py-2 text-sm"
              style={{ fontFamily: "var(--font-inter)", color: "var(--color-muted-gray)" }}
            >
              Trang {currentPage} / {meta.total_pages}
            </span>
            {currentPage < meta.total_pages && (
              <Link
                href={buildHref({ page: String(currentPage + 1) })}
                className="px-4 py-2 rounded-lg border text-sm transition-colors hover:border-[var(--color-lacquer-red)]"
                style={{
                  borderColor: "var(--color-border-tan)",
                  fontFamily: "var(--font-inter)",
                  color: "var(--fg)",
                }}
              >
                Tiếp →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
