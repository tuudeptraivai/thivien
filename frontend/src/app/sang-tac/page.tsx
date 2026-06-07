import type { Metadata } from "next";
import Link from "next/link";
import { PoemCard } from "@/components/poem/PoemCard";
import { getMemberPoems, getMemberTranslations } from "@/lib/server-api";

export const metadata: Metadata = { title: "Thơ Thành viên & Sáng tác" };

export default async function SangTacPage() {
  const [{ data: memberPoems }, { data: memberTranslations }] = await Promise.all([
    getMemberPoems({ limit: 18 }),
    getMemberTranslations({ limit: 12 }),
  ]);

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
            <Link href="/sang-tac/tro-ly" className="btn-primary px-4 py-2 text-sm">
              ✍️ Viết bài mới
            </Link>
          </div>
        </div>

        {/* ── Thơ sáng tác của thành viên ── */}
        <section className="mb-12">
          <h2 className="text-label-caps mb-4" style={{ color: "var(--color-muted-gray)" }}>
            THƠ SÁNG TÁC
          </h2>
          {memberPoems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {memberPoems.map((poem) => (
                <PoemCard key={poem.id} poem={poem} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 card" style={{ background: "var(--color-paper-pure)" }}>
              <p className="text-5xl mb-4">✍️</p>
              <p className="text-lg font-medium mb-2" style={{ fontFamily: "var(--font-lora)", color: "var(--fg)" }}>
                Chưa có bài thơ nào
              </p>
              <p className="text-sm mb-6" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
                Hãy là người đầu tiên chia sẻ thơ của bạn!
              </p>
              <Link href="/sang-tac/tro-ly" className="btn-primary px-6 py-2.5 text-sm inline-block">
                Viết bài thơ đầu tiên
              </Link>
            </div>
          )}
        </section>

        {/* ── Bản dịch do thành viên đóng góp ── */}
        {memberTranslations.length > 0 && (
          <section>
            <h2 className="text-label-caps mb-4" style={{ color: "var(--color-muted-gray)" }}>
              BẢN DỊCH CỦA THÀNH VIÊN
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {memberTranslations.map((t) => (
                <Link key={t.id} href={`/tho/${t.poem.slug}`} className="block">
                  <article className="card card-hover p-5 h-full">
                    <h3
                      className="poem-card-title text-base mb-1 line-clamp-2"
                      style={{ fontFamily: "var(--font-lora)", fontWeight: 600 }}
                    >
                      {t.translation_title || t.poem.title}
                    </h3>
                    <p className="text-sm mb-3" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
                      <span style={{ color: "var(--color-bamboo-green)" }}>{t.translator.name}</span>
                      {" dịch"}
                      {t.poem.author_name && (
                        <>
                          {" · nguyên tác "}
                          <span style={{ color: "var(--color-lacquer-red)" }}>{t.poem.author_name}</span>
                        </>
                      )}
                    </p>
                    {t.excerpt && (
                      <p
                        className="text-sm leading-relaxed line-clamp-3 whitespace-pre-line"
                        style={{ fontFamily: "var(--font-lora)", fontStyle: "italic", color: "var(--color-on-surface-variant)" }}
                      >
                        {t.excerpt}
                      </p>
                    )}
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
