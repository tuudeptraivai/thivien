import Link from "next/link";
import { PoemCard } from "@/components/poem/PoemCard";
import { formatNumber } from "@/lib/utils";
import HeroSearch from "@/components/home/HeroSearch";
import {
  getHomepagePoems,
  getFeaturedPoem,
  getTopAuthors,
  getHomeStats,
} from "@/lib/server-api";
import type { Poem } from "@/lib/types";

export const revalidate = 60;

const CATEGORIES = [
  { label: "Thơ Đường 🇨🇳", href: "/tho?category=duong-thi" },
  { label: "Thơ Nôm 🇻🇳",   href: "/tho?category=tho-nom" },
  { label: "Thơ mới ✍️",    href: "/tho?category=tho-moi" },
  { label: "Thành viên 🌱", href: "/sang-tac" },
];

function PoemFeed({ poems }: { poems: Poem[] }) {
  return (
    <div>
      <div
        className="flex gap-1 border-b mb-6"
        style={{ borderColor: "var(--color-border-tan)" }}
      >
        {["Mới thêm hôm nay", "Xem nhiều", "Thơ thành viên"].map((t, i) => (
          <span
            key={t}
            className="px-4 py-2.5 text-sm font-medium relative"
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {poems.map((poem) => (
          <PoemCard key={poem.id} poem={poem} />
        ))}
      </div>

      <div className="text-center mt-8">
        <Link
          href="/tho"
          className="btn-primary px-6 py-2.5 text-sm inline-block"
        >
          Xem tất cả thơ →
        </Link>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const [featured, recentPoems, topAuthors, stats] = await Promise.all([
    getFeaturedPoem(),
    getHomepagePoems(),
    getTopAuthors(),
    getHomeStats(),
  ]);

  return (
    <div style={{ background: "var(--color-background-parchment)" }}>
      {/* ── HERO ── */}
      <section className="text-center py-16 px-6">
        <p className="text-label-caps mb-3" style={{ color: "var(--color-bamboo-green)" }}>
          THƯ VIỆN THI CA VIỆT NAM
        </p>
        <h1
          className="text-display mb-8"
          style={{ fontFamily: "var(--font-lora)", color: "var(--fg)" }}
        >
          {formatNumber(stats.total_poems)} tác phẩm thi ca
        </h1>

        <HeroSearch />

        <div className="flex flex-wrap justify-center gap-2 mt-5">
          {CATEGORIES.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="px-4 py-1.5 rounded-full text-sm border transition-colors hover:border-[var(--color-lacquer-red)] hover:text-[var(--color-lacquer-red)]"
              style={{
                borderColor: "var(--color-border-tan)",
                color: "var(--color-muted-gray)",
                fontFamily: "var(--font-inter)",
              }}
            >
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED POEM ── */}
      <section className="max-w-[1280px] mx-auto px-6 mb-12">
        <div className="card p-8 relative overflow-hidden" style={{ background: "var(--color-paper-pure)" }}>
          <p className="text-label-caps mb-5" style={{ color: "var(--color-bamboo-green)" }}>
            THI PHẨM NỔI BẬT HÔM NAY
          </p>
          <div className="max-w-2xl">
            <blockquote
              className="text-2xl mb-6"
              style={{
                fontFamily: "var(--font-lora)",
                fontStyle: "italic",
                lineHeight: 2.1,
                color: "var(--fg)",
              }}
            >
              {featured.excerpt?.split("\n").map((line, i, arr) => (
                <span key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
            </blockquote>
            <div className="flex items-center gap-3">
              <Link
                href={`/tac-gia/${featured.author?.slug ?? "#"}`}
                className="font-semibold hover:underline"
                style={{ color: "var(--color-lacquer-red)", fontFamily: "var(--font-lora)" }}
              >
                {featured.author?.name ?? "Khuyết danh"}
              </Link>
              <span style={{ color: "var(--color-muted-gray)" }}>—</span>
              <Link
                href={`/tho/${featured.slug}`}
                style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-lora)", fontStyle: "italic" }}
                className="hover:underline"
              >
                {featured.title}
              </Link>
            </div>
          </div>
          <div
            className="absolute right-8 top-4 text-8xl opacity-5 pointer-events-none select-none"
            style={{ fontFamily: "var(--font-cjk)", color: "var(--color-lacquer-red)" }}
          >
            詩
          </div>
        </div>
      </section>

      {/* ── MAIN 2-COLUMN ── */}
      <div className="max-w-[1280px] mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">

          <section>
            <PoemFeed poems={recentPoems} />
          </section>

          <aside className="space-y-5">
            {/* Stats widget */}
            <div className="card p-5">
              <h3 className="text-label-caps mb-4" style={{ color: "var(--color-bamboo-green)" }}>
                THỐNG KÊ
              </h3>
              <div className="space-y-3">
                {[
                  { icon: "📚", value: formatNumber(stats.total_poems), label: "tác phẩm" },
                  { icon: "👤", value: formatNumber(stats.total_authors), label: "tác giả" },
                  { icon: "🌏", value: String(stats.total_countries), label: "quốc gia" },
                  { icon: "✍️", value: formatNumber(stats.total_members), label: "thành viên" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
                      {s.icon} {s.label}
                    </span>
                    <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-inter)", color: "var(--fg)" }}>
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
              <Link href="/thong-ke" className="mt-4 block text-center text-sm py-1.5 rounded-full border transition-colors hover:text-[var(--color-lacquer-red)]" style={{ borderColor: "var(--color-border-tan)", color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
                Xem chi tiết →
              </Link>
            </div>

            {/* Top authors */}
            <div className="card p-5">
              <h3 className="text-label-caps mb-4" style={{ color: "var(--color-bamboo-green)" }}>
                TÁC GIẢ NỔI BẬT
              </h3>
              <ul className="space-y-2">
                {topAuthors.map((a) => (
                  <li key={a.id}>
                    <Link href={`/tac-gia/${a.slug}`} className="flex items-center gap-2 group py-1">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0" style={{ background: "var(--color-lacquer-red)" }}>
                        {a.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate group-hover:text-[var(--color-lacquer-red)] transition-colors" style={{ fontFamily: "var(--font-lora)", color: "var(--fg)" }}>
                          {a.name}
                        </p>
                        <p className="text-xs" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
                          {a.country} · {a.poem_count} bài
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/tac-gia" className="mt-3 block text-center text-sm py-1.5 rounded-full border transition-colors hover:text-[var(--color-lacquer-red)]" style={{ borderColor: "var(--color-border-tan)", color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
                Tất cả tác giả →
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
