"use client";
import { useStore } from "@/stores/useStore";

const FONT_OPTIONS: { label: string; value: "Lora" | "Inter" }[] = [
  { label: "Serif", value: "Lora" },
  { label: "Sans", value: "Inter" },
];

const SIZE_OPTIONS: { label: string; value: "sm" | "md" | "lg" }[] = [
  { label: "A-", value: "sm" },
  { label: "A",  value: "md" },
  { label: "A+", value: "lg" },
];

const THEME_OPTIONS: { label: string; value: "parchment" | "sepia" | "dark" }[] = [
  { label: "Giấy", value: "parchment" },
  { label: "Sepia", value: "sepia" },
  { label: "Tối",  value: "dark" },
];

export default function ReaderToolbar() {
  const { readerFont, readerFontSize, readerTheme, setReaderFont, setReaderFontSize, setReaderTheme } = useStore();

  return (
    <div className="sticky top-16 z-40 flex justify-center py-2">
      <div
        className="flex items-center gap-1 px-4 py-2 rounded-full text-xs"
        style={{
          backdropFilter: "blur(12px)",
          background: "rgba(247,244,235,0.9)",
          border: "1px solid var(--color-border-tan)",
          fontFamily: "var(--font-inter)",
        }}
      >
        {/* Font size */}
        <div className="flex items-center gap-0.5 pr-3 border-r" style={{ borderColor: "var(--color-border-tan)" }}>
          {SIZE_OPTIONS.map((s) => (
            <button
              key={s.value}
              onClick={() => setReaderFontSize(s.value)}
              className="px-2 py-1 rounded transition-colors"
              style={{
                fontWeight: s.value === "md" ? 500 : 400,
                background: readerFontSize === s.value ? "var(--color-lacquer-red)" : "transparent",
                color: readerFontSize === s.value ? "#fff" : "var(--color-muted-gray)",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Font family */}
        <div className="flex items-center gap-0.5 px-3 border-r" style={{ borderColor: "var(--color-border-tan)" }}>
          {FONT_OPTIONS.map((f) => (
            <button
              key={f.value}
              onClick={() => setReaderFont(f.value)}
              className="px-2 py-1 rounded transition-colors"
              style={{
                fontFamily: f.value === "Lora" ? "var(--font-lora)" : "var(--font-inter)",
                background: readerFont === f.value ? "var(--color-lacquer-red)" : "transparent",
                color: readerFont === f.value ? "#fff" : "var(--color-muted-gray)",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Theme */}
        <div className="flex items-center gap-0.5 pl-3">
          {THEME_OPTIONS.map((t) => (
            <button
              key={t.value}
              onClick={() => setReaderTheme(t.value)}
              className="px-2 py-1 rounded transition-colors"
              style={{
                background: readerTheme === t.value ? "var(--color-lacquer-red)" : "transparent",
                color: readerTheme === t.value ? "#fff" : "var(--color-muted-gray)",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
