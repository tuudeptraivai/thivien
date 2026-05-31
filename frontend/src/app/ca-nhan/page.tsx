import type { Metadata } from "next";
import Link from "next/link";
import { PoemCard } from "@/components/poem/PoemCard";
import { MOCK_POEMS } from "@/lib/mockData";

export const metadata: Metadata = { title: "Tủ thơ cá nhân" };

export default function CaNhanPage() {
  return (
    <div style={{ background: "var(--color-background-parchment)", minHeight: "100vh" }}>
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-label-caps mb-2" style={{ color: "var(--color-bamboo-green)" }}>
              CÁ NHÂN
            </p>
            <h1 className="text-headline-lg" style={{ fontFamily: "var(--font-lora)", color: "var(--fg)" }}>
              Tủ thơ yêu thích
            </h1>
          </div>
          <Link href="/dang-nhap" className="btn-primary px-4 py-2 text-sm mt-2">
            Đăng nhập để lưu thơ
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b mb-6" style={{ borderColor: "var(--color-border-tan)" }}>
          {["Thơ yêu thích", "Thơ đã đọc", "Tủ sách", "Cài đặt đọc"].map((t, i) => (
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_POEMS.slice(0, 3).map((poem) => (
            <PoemCard key={poem.id} poem={poem} />
          ))}
        </div>
      </div>
    </div>
  );
}
