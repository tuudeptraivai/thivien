import type { Metadata } from "next";
import Link from "next/link";
import { formatNumber } from "@/lib/utils";
import { getStatisticsSummary, getPoemsList, getTopAuthors } from "@/lib/server-api";

export const metadata: Metadata = { title: "Thống kê Thi Uyển" };
export const revalidate = 120;

export default async function ThongKePage() {
  const [stats, { data: topPoems }, topAuthors] = await Promise.all([
    getStatisticsSummary(),
    getPoemsList({ sort: "views", limit: 5 }),
    getTopAuthors(5),
  ]);

  const KPI = [
    { label: "Tác phẩm", value: stats.total_poems, icon: "📚" },
    { label: "Tác giả", value: stats.total_authors, icon: "👤" },
    { label: "Quốc gia", value: stats.total_countries, icon: "🌏" },
    { label: "Thành viên", value: stats.total_members, icon: "✍️" },
    { label: "Bản dịch", value: stats.total_translations, icon: "🔤" },
  ];

  return (
    <div style={{ background: "var(--color-background-parchment)", minHeight: "100vh" }}>
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        <p className="text-label-caps mb-2" style={{ color: "var(--color-bamboo-green)" }}>
          TỔNG QUAN
        </p>
        <h1 className="text-headline-lg mb-10" style={{ fontFamily: "var(--font-lora)", color: "var(--fg)" }}>
          Thống kê Thi Uyển
        </h1>

        {/* KPI grid */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          {KPI.map((k) => (
            <div key={k.label} className="card p-5 text-center">
              <p className="text-3xl mb-2">{k.icon}</p>
              <p
                className="text-2xl font-bold mb-1"
                style={{ fontFamily: "var(--font-lora)", color: "var(--color-lacquer-red)" }}
              >
                {formatNumber(k.value)}
              </p>
              <p className="text-sm font-medium" style={{ fontFamily: "var(--font-inter)", color: "var(--fg)" }}>
                {k.label}
              </p>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Top poems */}
          <div className="card p-6">
            <h2 className="text-label-caps mb-5" style={{ color: "var(--color-bamboo-green)" }}>
              TÁC PHẨM XEM NHIỀU NHẤT
            </h2>
            {topPoems.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
                Chưa có dữ liệu.
              </p>
            ) : (
              <ol className="space-y-3">
                {topPoems.map((poem, i) => (
                  <li key={poem.id} className="flex items-start gap-3">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5"
                      style={{ background: i < 3 ? "var(--color-lacquer-red)" : "var(--color-muted-gray)" }}
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <Link
                        href={`/tho/${poem.slug}`}
                        className="text-sm font-semibold hover:text-[var(--color-lacquer-red)] transition-colors line-clamp-1"
                        style={{ fontFamily: "var(--font-lora)", color: "var(--fg)" }}
                      >
                        {poem.title}
                      </Link>
                      <p className="text-xs" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
                        {poem.author?.name ?? "Khuyết danh"} · {formatNumber(poem.view_count)} lượt xem
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>

          {/* Top authors */}
          <div className="card p-6">
            <h2 className="text-label-caps mb-5" style={{ color: "var(--color-bamboo-green)" }}>
              TÁC GIẢ NHIỀU TÁC PHẨM
            </h2>
            {topAuthors.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
                Chưa có dữ liệu.
              </p>
            ) : (
              <ol className="space-y-3">
                {topAuthors.map((author, i) => (
                  <li key={author.id} className="flex items-center gap-3">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ background: i < 3 ? "var(--color-lacquer-red)" : "var(--color-muted-gray)" }}
                    >
                      {i + 1}
                    </span>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs text-white font-semibold shrink-0"
                      style={{ background: "var(--color-bamboo-green)" }}
                    >
                      {author.name.charAt(0)}
                    </div>
                    <div>
                      <Link
                        href={`/tac-gia/${author.slug}`}
                        className="text-sm font-medium hover:text-[var(--color-lacquer-red)] transition-colors"
                        style={{ fontFamily: "var(--font-lora)", color: "var(--fg)" }}
                      >
                        {author.name}
                      </Link>
                      <p className="text-xs" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
                        {author.poem_count} tác phẩm
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
