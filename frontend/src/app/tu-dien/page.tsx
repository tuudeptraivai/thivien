"use client";
import { useState } from "react";

const SAMPLE_ENTRIES = [
  {
    char: "詩",
    han_viet: "Thi",
    meaning: "Thơ ca; sự sáng tác thơ văn. Một trong Lục nghệ của Nho học.",
    stroke_count: 13,
    radical: "言 (ngôn)",
    examples: ["Thi ca (詩歌) — thơ và nhạc", "Thi nhân (詩人) — nhà thơ"],
  },
  {
    char: "月",
    han_viet: "Nguyệt",
    meaning: "Mặt trăng; tháng (đơn vị thời gian). Biểu tượng thường xuất hiện trong thơ Đường.",
    stroke_count: 4,
    radical: "月 (nguyệt)",
    examples: ["Minh nguyệt (明月) — trăng sáng", "Nguyệt quang (月光) — ánh trăng"],
  },
  {
    char: "心",
    han_viet: "Tâm",
    meaning: "Tâm hồn; trái tim; nội tâm. Thường dùng ẩn dụ về tình cảm, ý chí.",
    stroke_count: 4,
    radical: "心 (tâm)",
    examples: ["Tâm tình (心情) — tâm trạng", "Bất tâm (不心) — không có lòng"],
  },
];

export default function TuDienPage() {
  const [keyword, setKeyword] = useState("");
  const [selected, setSelected] = useState(SAMPLE_ENTRIES[0]);

  const filtered = keyword
    ? SAMPLE_ENTRIES.filter(
        (e) =>
          e.han_viet.toLowerCase().includes(keyword.toLowerCase()) ||
          e.char.includes(keyword) ||
          e.meaning.toLowerCase().includes(keyword.toLowerCase())
      )
    : SAMPLE_ENTRIES;

  return (
    <div style={{ background: "var(--color-background-parchment)", minHeight: "100vh" }}>
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        <p className="text-label-caps mb-2" style={{ color: "var(--color-bamboo-green)" }}>
          CÔNG CỤ
        </p>
        <h1 className="text-headline-lg mb-8" style={{ fontFamily: "var(--font-lora)", color: "var(--fg)" }}>
          Từ điển Hán–Việt
        </h1>

        {/* Search */}
        <div className="search-pill flex items-center gap-3 px-5 py-3.5 max-w-lg mb-8">
          <svg className="w-5 h-5 shrink-0" style={{ color: "var(--color-lacquer-red)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tra chữ Hán, phiên âm Hán-Việt hoặc nghĩa tiếng Việt..."
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ fontFamily: "var(--font-inter)", color: "var(--fg)" }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
          {/* Left: results list */}
          <aside>
            <div className="card overflow-hidden">
              {filtered.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
                    Không tìm thấy kết quả
                  </p>
                </div>
              ) : (
                <ul>
                  {filtered.map((entry) => (
                    <li key={entry.char}>
                      <button
                        onClick={() => setSelected(entry)}
                        className="w-full text-left px-5 py-4 flex items-center gap-4 border-b transition-colors hover:bg-[rgba(142,36,36,0.04)]"
                        style={{
                          borderColor: "var(--color-border-tan)",
                          background: selected.char === entry.char ? "rgba(142,36,36,0.06)" : "transparent",
                        }}
                      >
                        <span
                          className="text-3xl shrink-0"
                          style={{ fontFamily: "var(--font-cjk)", color: selected.char === entry.char ? "var(--color-lacquer-red)" : "var(--fg)" }}
                        >
                          {entry.char}
                        </span>
                        <div>
                          <p className="font-semibold text-sm" style={{ fontFamily: "var(--font-inter)", color: "var(--fg)" }}>
                            {entry.han_viet}
                          </p>
                          <p className="text-xs line-clamp-1" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
                            {entry.meaning}
                          </p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>

          {/* Right: entry detail */}
          <section className="card p-8" style={{ background: "var(--color-paper-pure)" }}>
            {/* Big character display */}
            <div className="text-center mb-8">
              <p
                className="text-[96px] leading-none font-bold mb-2"
                style={{ fontFamily: "var(--font-cjk)", color: "var(--color-lacquer-red)" }}
              >
                {selected.char}
              </p>
              <p
                className="text-2xl font-semibold"
                style={{ fontFamily: "var(--font-lora)", color: "var(--fg)" }}
              >
                {selected.han_viet}
              </p>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-label-caps mb-1" style={{ color: "var(--color-bamboo-green)" }}>SỐ NÉT</p>
                <p className="text-lg font-semibold" style={{ fontFamily: "var(--font-lora)", color: "var(--fg)" }}>
                  {selected.stroke_count} nét
                </p>
              </div>
              <div>
                <p className="text-label-caps mb-1" style={{ color: "var(--color-bamboo-green)" }}>BỘ THỦ</p>
                <p className="text-lg font-semibold" style={{ fontFamily: "var(--font-lora)", color: "var(--fg)" }}>
                  {selected.radical}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-label-caps mb-2" style={{ color: "var(--color-bamboo-green)" }}>NGHĨA</p>
              <p
                className="leading-relaxed"
                style={{ fontFamily: "var(--font-inter)", color: "var(--fg)", fontSize: 15, lineHeight: 1.8 }}
              >
                {selected.meaning}
              </p>
            </div>

            <div>
              <p className="text-label-caps mb-3" style={{ color: "var(--color-bamboo-green)" }}>VÍ DỤ</p>
              <ul className="space-y-2">
                {selected.examples.map((ex) => (
                  <li
                    key={ex}
                    className="flex items-center gap-2 text-sm"
                    style={{ fontFamily: "var(--font-inter)", color: "var(--fg)" }}
                  >
                    <span style={{ color: "var(--color-bamboo-green)" }}>▸</span>
                    {ex}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
