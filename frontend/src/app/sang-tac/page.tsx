import type { Metadata } from "next";
import Link from "next/link";
import { PoemCard } from "@/components/poem/PoemCard";
import { MOCK_POEMS } from "@/lib/mockData";

export const metadata: Metadata = { title: "Thơ Thành viên & Sáng tác" };

const memberPoems = MOCK_POEMS.filter((p) => p.is_member_poem);

export default function SangTacPage() {
  return (
    <div style={{ background: "var(--color-background-parchment)", minHeight: "100vh" }}>
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-label-caps mb-2" style={{ color: "var(--color-bamboo-green)" }}>
              CỘNG ĐỒNG
            </p>
            <h1 className="text-headline-lg" style={{ fontFamily: "var(--font-lora)", color: "var(--fg)" }}>
              Thơ Thành viên
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
              Không gian sáng tác và chia sẻ thơ của cộng đồng
            </p>
          </div>
          <div className="flex gap-2 mt-2">
            <Link href="/sang-tac/tro-ly" className="btn-ghost px-4 py-2 text-sm" style={{ color: "var(--color-bamboo-green)", borderColor: "var(--color-bamboo-green)" }}>
              🤖 Trợ lý gieo vần
            </Link>
            <Link href="/sang-tac/moi" className="btn-primary px-4 py-2 text-sm">
              ✍️ Viết bài mới
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b mb-6" style={{ borderColor: "var(--color-border-tan)" }}>
          {["Mới nhất", "Nổi bật", "Tôi đang theo dõi"].map((t, i) => (
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

        {memberPoems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {memberPoems.map((poem) => (
              <PoemCard key={poem.id} poem={poem} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">✍️</p>
            <p className="text-lg font-medium mb-2" style={{ fontFamily: "var(--font-lora)", color: "var(--fg)" }}>
              Chưa có bài thơ nào
            </p>
            <p className="text-sm mb-6" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
              Hãy là người đầu tiên chia sẻ thơ của bạn!
            </p>
            <Link href="/sang-tac/moi" className="btn-primary px-6 py-2.5 text-sm inline-block">
              Viết bài thơ đầu tiên
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
