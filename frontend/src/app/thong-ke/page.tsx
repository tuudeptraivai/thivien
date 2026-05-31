import type { Metadata } from "next";
import { MOCK_STATS, MOCK_AUTHORS, MOCK_POEMS } from "@/lib/mockData";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";

export const metadata: Metadata = { title: "Thống kê Thi Uyển" };

const KPI = [
  { label: "Tác phẩm", value: MOCK_STATS.total_poems, icon: "📚", change: "+248 tuần này" },
  { label: "Tác giả",  value: MOCK_STATS.total_authors, icon: "👤", change: "+12 tác giả mới" },
  { label: "Quốc gia", value: MOCK_STATS.total_countries, icon: "🌏", change: "111 quốc gia" },
  { label: "Thành viên", value: MOCK_STATS.total_members, icon: "✍️", change: "+180 tuần này" },
  { label: "Bản dịch", value: MOCK_STATS.total_translations, icon: "🔤", change: "+56 tuần này" },
];

const TOP_POEMS = MOCK_POEMS
  .slice()
  .sort((a, b) => b.view_count - a.view_count)
  .slice(0, 5);

const TOP_AUTHORS = MOCK_AUTHORS
  .slice()
  .sort((a, b) => b.poem_count - a.poem_count)
  .slice(0, 5);

const COUNTRY_DIST = [
  { country: "Việt Nam",    count: 42000, pct: 37 },
  { country: "Trung Quốc", count: 51000, pct: 45 },
  { country: "Nhật Bản",   count: 8500,  pct: 8 },
  { country: "Khác",       count: 10881, pct: 10 },
];

export default function ThongKePage() {
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
              <p className="text-sm font-medium mb-1" style={{ fontFamily: "var(--font-inter)", color: "var(--fg)" }}>
                {k.label}
              </p>
              <p className="text-xs" style={{ color: "var(--color-bamboo-green)", fontFamily: "var(--font-inter)" }}>
                {k.change}
              </p>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Country distribution */}
          <div className="card p-6 lg:col-span-1">
            <h2 className="text-label-caps mb-5" style={{ color: "var(--color-bamboo-green)" }}>
              PHÂN BỐ THEO QUỐC GIA
            </h2>
            <div className="space-y-4">
              {COUNTRY_DIST.map((c) => (
                <div key={c.country}>
                  <div className="flex justify-between text-sm mb-1">
                    <span style={{ fontFamily: "var(--font-inter)", color: "var(--fg)" }}>{c.country}</span>
                    <span style={{ fontFamily: "var(--font-inter)", color: "var(--color-muted-gray)" }}>
                      {formatNumber(c.count)} ({c.pct}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--color-surface-container)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${c.pct}%`,
                        background: "var(--color-lacquer-red)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top poems */}
          <div className="card p-6">
            <h2 className="text-label-caps mb-5" style={{ color: "var(--color-bamboo-green)" }}>
              TÁC PHẨM XEM NHIỀU NHẤT
            </h2>
            <ol className="space-y-3">
              {TOP_POEMS.map((poem, i) => (
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
                      {poem.author.name} · {formatNumber(poem.view_count)} lượt xem
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Top authors */}
          <div className="card p-6">
            <h2 className="text-label-caps mb-5" style={{ color: "var(--color-bamboo-green)" }}>
              TÁC GIẢ NHIỀU NHẤT
            </h2>
            <ol className="space-y-3">
              {TOP_AUTHORS.map((author, i) => (
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
          </div>
        </div>
      </div>
    </div>
  );
}
