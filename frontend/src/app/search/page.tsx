import type { Metadata } from "next";
import { PoemCard } from "@/components/poem/PoemCard";
import { getPoemsList } from "@/lib/server-api";

export const metadata: Metadata = { title: "Tìm kiếm thơ" };

const ERAS   = ["Tất cả", "Đường thi", "Trung đại", "Thơ mới", "Hiện đại"];
const TYPES  = ["Tất cả", "Chính thống", "Thành viên"];
const LANGS  = ["Tất cả", "Tiếng Việt", "Chữ Hán", "Song ngữ"];

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const { data: results, meta } = q
    ? await getPoemsList({ search: q, limit: 24 })
    : { data: [], meta: { total_records: 0, total_pages: 1, current_page: 1, limit: 24 } };

  return (
    <div style={{ background: "var(--color-background-parchment)", minHeight: "100vh" }}>
      <div className="max-w-[1280px] mx-auto px-6 py-10">
        <h1 className="text-headline-md mb-6" style={{ fontFamily: "var(--font-lora)", color: "var(--fg)" }}>
          {q ? `Kết quả tìm kiếm: "${q}"` : "Tìm kiếm nâng cao"}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
          {/* Sidebar filters */}
          <aside>
            <div className="card p-5 sticky top-24 space-y-6">
              {/* Search input */}
              <div>
                <label className="text-label-caps block mb-2" style={{ color: "var(--color-bamboo-green)" }}>
                  TỪ KHOÁ
                </label>
                <form action="/search" method="get" className="search-pill flex items-center gap-2 px-3 py-2">
                  <svg className="w-4 h-4 shrink-0" style={{ color: "var(--color-muted-gray)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                  <input
                    name="q"
                    defaultValue={q}
                    placeholder="Nhập từ khoá..."
                    className="bg-transparent outline-none text-sm flex-1"
                    style={{ fontFamily: "var(--font-inter)", color: "var(--fg)" }}
                  />
                </form>
              </div>

              {/* Era */}
              <div>
                <label className="text-label-caps block mb-2" style={{ color: "var(--color-bamboo-green)" }}>
                  TRIỀU ĐẠI
                </label>
                <div className="flex flex-col gap-1">
                  {ERAS.map((e, i) => (
                    <label key={e} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="era"
                        defaultChecked={i === 0}
                        className="accent-[var(--color-lacquer-red)]"
                      />
                      <span className="text-sm" style={{ fontFamily: "var(--font-inter)", color: "var(--fg)" }}>{e}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Type */}
              <div>
                <label className="text-label-caps block mb-2" style={{ color: "var(--color-bamboo-green)" }}>
                  LOẠI THƠ
                </label>
                <div className="flex flex-col gap-1">
                  {TYPES.map((t, i) => (
                    <label key={t} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        defaultChecked={i === 0}
                        className="accent-[var(--color-lacquer-red)]"
                      />
                      <span className="text-sm" style={{ fontFamily: "var(--font-inter)", color: "var(--fg)" }}>{t}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div>
                <label className="text-label-caps block mb-2" style={{ color: "var(--color-bamboo-green)" }}>
                  NGÔN NGỮ
                </label>
                <div className="flex flex-col gap-1">
                  {LANGS.map((l, i) => (
                    <label key={l} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="lang"
                        defaultChecked={i === 0}
                        className="accent-[var(--color-lacquer-red)]"
                      />
                      <span className="text-sm" style={{ fontFamily: "var(--font-inter)", color: "var(--fg)" }}>{l}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button className="btn-primary w-full py-2 text-sm">
                Áp dụng bộ lọc
              </button>
            </div>
          </aside>

          {/* Results */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
                Tìm thấy <strong style={{ color: "var(--fg)" }}>{meta.total_records}</strong> kết quả
                {q && <> cho <strong style={{ color: "var(--color-lacquer-red)" }}>&ldquo;{q}&rdquo;</strong></>}
              </p>
              <select
                className="text-sm border rounded-md px-2 py-1 outline-none"
                style={{ borderColor: "var(--color-border-tan)", background: "var(--card-bg)", color: "var(--fg)", fontFamily: "var(--font-inter)" }}
              >
                <option>Liên quan nhất</option>
                <option>Mới nhất</option>
                <option>Xem nhiều nhất</option>
                <option>A–Z</option>
              </select>
            </div>

            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.map((poem) => (
                  <PoemCard key={poem.id} poem={poem} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-4xl mb-4">🔍</p>
                <p className="text-lg font-medium mb-2" style={{ fontFamily: "var(--font-lora)", color: "var(--fg)" }}>
                  Không tìm thấy kết quả
                </p>
                <p className="text-sm" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
                  Hãy thử với từ khóa khác hoặc bỏ bớt bộ lọc
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
