"use client";
import { useState } from "react";
import type { Metadata } from "next";

const POEM_STYLES = ["Lục bát (6-8 âm)", "Đường luật thất ngôn", "Tứ tuyệt", "Thơ mới tự do"];
const RHYME_SUGGESTIONS: Record<string, string[]> = {
  hiên: ["yên", "thiền", "miền", "duyên", "niềm", "huyền"],
  hương: ["thương", "vương", "mường", "phương", "đường", "sương"],
  mây: ["tây", "bay", "say", "xây", "ngày", "đầy"],
};

export default function TroLyPage() {
  const [title, setTitle] = useState("Mưa mùa xuân");
  const [style, setStyle] = useState(POEM_STYLES[0]);
  const [lines, setLines] = useState([
    "Mưa bay lất phất ngoài hiên",
    "Giọt sương đọng lại buồn riêng nỗi niềm",
  ]);

  function countSyllables(line: string) {
    return line.trim().split(/\s+/).filter(Boolean).length;
  }

  function getLastWord(line: string) {
    const words = line.trim().split(/\s+/);
    return words[words.length - 1]?.toLowerCase() ?? "";
  }

  const lastWord = getLastWord(lines[lines.length - 1] ?? "");
  const rhymes = RHYME_SUGGESTIONS[lastWord] ?? ["yên", "thiền", "miền", "duyên", "niềm"];

  function handleLineChange(i: number, value: string) {
    setLines((prev) => {
      const next = [...prev];
      next[i] = value;
      return next;
    });
  }

  function addLine() {
    setLines((prev) => [...prev, ""]);
  }

  return (
    <div style={{ background: "#FAF9F6", minHeight: "100vh" }}>
      <div className="max-w-[1280px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_260px] gap-6 h-[calc(100vh-120px)]">

          {/* LEFT: drafts list */}
          <aside className="card p-4 overflow-y-auto">
            <h3 className="text-label-caps mb-4" style={{ color: "var(--color-bamboo-green)" }}>
              BẢN THẢO
            </h3>
            <ul className="space-y-1 mb-4">
              {[
                { title: "Mưa mùa xuân", active: true },
                { title: "Chiều vàng sông Hương", active: false },
              ].map((d) => (
                <li key={d.title}>
                  <button
                    className="w-full text-left px-3 py-2 rounded-md text-sm transition-colors"
                    style={{
                      fontFamily: "var(--font-inter)",
                      background: d.active ? "rgba(142,36,36,0.08)" : "transparent",
                      color: d.active ? "var(--color-lacquer-red)" : "var(--fg)",
                      fontWeight: d.active ? 500 : 400,
                    }}
                  >
                    📄 {d.title}
                  </button>
                </li>
              ))}
            </ul>
            <button
              className="w-full py-2 rounded-lg text-sm font-medium border-2 border-dashed transition-colors hover:border-[var(--color-bamboo-green)] hover:text-[var(--color-bamboo-green)]"
              style={{ borderColor: "var(--color-border-tan)", color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}
            >
              + Bài mới
            </button>
          </aside>

          {/* CENTER: editor */}
          <div
            className="card flex flex-col overflow-hidden"
            style={{ background: "#FFFFFF", border: "1.5px solid #D4C89A" }}
          >
            {/* Title */}
            <div className="p-6 border-b" style={{ borderColor: "var(--color-border-tan)" }}>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Tựa đề bài thơ..."
                className="w-full text-2xl outline-none bg-transparent font-semibold"
                style={{ fontFamily: "var(--font-lora)", color: "var(--fg)" }}
              />
              <div className="flex items-center gap-3 mt-3">
                <label className="text-xs" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
                  Thể thơ:
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="text-sm border rounded-md px-2 py-1 outline-none"
                  style={{ borderColor: "var(--color-border-tan)", background: "transparent", fontFamily: "var(--font-inter)", color: "var(--fg)" }}
                >
                  {POEM_STYLES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Lines */}
            <div className="flex-1 p-6 overflow-y-auto space-y-2">
              {lines.map((line, i) => {
                const count = countSyllables(line);
                const expected = i % 2 === 0 ? 6 : 8;
                const isOk = count === 0 || count === expected;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <textarea
                      rows={1}
                      value={line}
                      onChange={(e) => handleLineChange(i, e.target.value)}
                      placeholder={`Câu ${i + 1}...`}
                      className="flex-1 resize-none outline-none bg-transparent text-lg leading-relaxed"
                      style={{ fontFamily: "var(--font-lora)", color: "var(--fg)", fontStyle: "italic" }}
                    />
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
                      style={{
                        background: isOk ? "rgba(44,94,67,0.1)" : "rgba(186,26,26,0.1)",
                        color: isOk ? "var(--color-bamboo-green)" : "var(--color-error)",
                        fontFamily: "var(--font-inter)",
                      }}
                    >
                      [{count}]
                    </span>
                  </div>
                );
              })}
              <button
                onClick={addLine}
                className="text-sm mt-2 px-3 py-1 rounded"
                style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}
              >
                + Thêm câu
              </button>
            </div>

            {/* Actions */}
            <div className="p-4 border-t flex justify-between items-center" style={{ borderColor: "var(--color-border-tan)" }}>
              <button className="btn-ghost px-4 py-2 text-sm" style={{ color: "var(--color-muted-gray)" }}>
                💾 Lưu bản thảo
              </button>
              <button className="btn-primary px-5 py-2 text-sm" style={{ background: "var(--color-bamboo-green)" }}>
                🌐 Đăng lên cộng đồng
              </button>
            </div>
          </div>

          {/* RIGHT: AI assistant */}
          <aside className="card p-5 overflow-y-auto" style={{ background: "#F0F4F1" }}>
            <h3 className="text-label-caps mb-4 flex items-center gap-2" style={{ color: "var(--color-bamboo-green)" }}>
              <span>✨</span> TRỢ LÝ AI
            </h3>

            {/* Rhythm map */}
            <div className="mb-5">
              <p className="text-xs font-semibold mb-2" style={{ fontFamily: "var(--font-inter)", color: "var(--fg)" }}>
                Sơ đồ luật bằng–trắc (Lục bát):
              </p>
              <div className="flex flex-wrap gap-1.5">
                {["B", "—", "B", "—", "B̲", "B", "—", "B", "—", "B", "—", "B̲", "B"].map((tone, i) => (
                  <span
                    key={i}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: tone.includes("̲") ? "rgba(186,26,26,0.15)" : tone === "B" ? "rgba(44,94,67,0.1)" : "var(--color-surface-container)",
                      color: tone.includes("̲") ? "var(--color-error)" : "var(--fg)",
                      fontFamily: "var(--font-inter)",
                      border: tone.includes("̲") ? "1.5px solid var(--color-error)" : "none",
                    }}
                  >
                    {tone.replace("̲", "")}
                  </span>
                ))}
              </div>
              <p className="text-xs mt-2" style={{ color: "var(--color-error)", fontFamily: "var(--font-inter)" }}>
                ⚠️ Âm tiết 6 cần vần BẰNG
              </p>
            </div>

            {/* Rhyme suggestions */}
            <div>
              <p className="text-xs font-semibold mb-2" style={{ fontFamily: "var(--font-inter)", color: "var(--fg)" }}>
                Gợi ý vần với <strong style={{ color: "var(--color-lacquer-red)" }}>"{lastWord}"</strong>:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {rhymes.map((r) => (
                  <button
                    key={r}
                    className="px-3 py-1 rounded-full text-sm border transition-colors hover:border-[var(--color-bamboo-green)] hover:text-[var(--color-bamboo-green)]"
                    style={{
                      borderColor: "var(--color-border-tan)",
                      color: "var(--fg)",
                      fontFamily: "var(--font-lora)",
                      background: "var(--color-paper-pure)",
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div
              className="mt-5 p-3 rounded-lg text-xs"
              style={{
                background: "rgba(44,94,67,0.08)",
                color: "var(--color-bamboo-green)",
                fontFamily: "var(--font-inter)",
                lineHeight: 1.7,
              }}
            >
              💡 <strong>Mẹo:</strong> Trong thơ Lục bát, tiếng thứ 6 câu 6 chữ phải vần với tiếng thứ 6 câu 8 chữ tiếp theo.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
