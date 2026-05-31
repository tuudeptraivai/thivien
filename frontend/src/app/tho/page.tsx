import type { Metadata } from "next";
import Link from "next/link";
import { PoemCard } from "@/components/poem/PoemCard";
import { MOCK_POEMS } from "@/lib/mockData";

export const metadata: Metadata = { title: "Thể loại Thơ" };

const CATEGORIES = [
  { name: "Đường thi", slug: "duong-thi", count: 38420, emoji: "🏯" },
  { name: "Thơ Nôm",   slug: "tho-nom",   count: 12500, emoji: "🌸" },
  { name: "Thơ lục bát", slug: "luc-bat", count: 8900,  emoji: "🌾" },
  { name: "Thơ mới",    slug: "tho-moi",  count: 21000, emoji: "✍️" },
  { name: "Thơ Đường luật", slug: "duong-luat", count: 9800, emoji: "📜" },
  { name: "Thơ tứ tuyệt",  slug: "tu-tuyet", count: 7600, emoji: "🍃" },
  { name: "Thơ thất ngôn",  slug: "that-ngon", count: 6200, emoji: "📖" },
  { name: "Từ khúc",       slug: "tu-khuc",  count: 3100, emoji: "🎵" },
];

export default function PoemListPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
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

        {/* Category cards — horizontal scroll on mobile */}
        <section className="mb-12">
          <h2 className="text-label-caps mb-4" style={{ color: "var(--color-muted-gray)" }}>
            THỂ LOẠI
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/tho?category=${cat.slug}`}
                className="card card-hover p-4 flex flex-col gap-2"
              >
                <span className="text-2xl">{cat.emoji}</span>
                <h3
                  className="text-sm font-semibold"
                  style={{ fontFamily: "var(--font-lora)", color: "var(--fg)" }}
                >
                  {cat.name}
                </h3>
                <p className="text-xs" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
                  {cat.count.toLocaleString()} bài
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Poem list */}
        <section>
          <h2 className="text-label-caps mb-4" style={{ color: "var(--color-muted-gray)" }}>
            TẤT CẢ TÁC PHẨM
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_POEMS.map((poem) => (
              <PoemCard key={poem.id} poem={poem} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
