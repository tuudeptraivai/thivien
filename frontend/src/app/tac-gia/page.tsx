import type { Metadata } from "next";
import Link from "next/link";
import { AuthorCard } from "@/components/author/AuthorCard";
import { MOCK_AUTHORS } from "@/lib/mockData";

export const metadata: Metadata = { title: "Danh bạ Tác giả" };

const ERAS = ["Tất cả", "Đường thi", "Trung đại Việt", "Thơ mới", "Hiện đại"];
const COUNTRIES = ["Tất cả", "Việt Nam", "Trung Quốc", "Nhật Bản", "Hàn Quốc"];

export default function AuthorListPage() {
  return (
    <div style={{ background: "var(--color-background-parchment)", minHeight: "100vh" }}>
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <p className="text-label-caps mb-2" style={{ color: "var(--color-bamboo-green)" }}>
            DANH BẠ
          </p>
          <h1
            className="text-headline-lg"
            style={{ fontFamily: "var(--font-lora)", color: "var(--fg)" }}
          >
            Tác giả & Nhà thơ
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
            {MOCK_AUTHORS.length.toLocaleString()} tác giả từ 111 quốc gia qua mọi thời đại
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          {/* Search */}
          <div className="search-pill flex items-center gap-2 px-4 py-2 flex-1 min-w-[200px] max-w-xs">
            <svg className="w-4 h-4 shrink-0" style={{ color: "var(--color-muted-gray)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              placeholder="Tìm tên tác giả..."
              className="bg-transparent outline-none text-sm flex-1"
              style={{ fontFamily: "var(--font-inter)", color: "var(--fg)" }}
            />
          </div>

          {/* Era filter */}
          <div className="flex flex-wrap gap-2">
            {ERAS.map((e, i) => (
              <button
                key={e}
                className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
                style={{
                  borderColor: i === 0 ? "var(--color-lacquer-red)" : "var(--color-border-tan)",
                  color: i === 0 ? "var(--color-lacquer-red)" : "var(--color-muted-gray)",
                  background: i === 0 ? "rgba(142,36,36,0.06)" : "transparent",
                  fontFamily: "var(--font-inter)",
                }}
              >
                {e}
              </button>
            ))}
          </div>

          {/* Country filter */}
          <div className="flex flex-wrap gap-2">
            {COUNTRIES.map((c, i) => (
              <button
                key={c}
                className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
                style={{
                  borderColor: i === 0 ? "var(--color-bamboo-green)" : "var(--color-border-tan)",
                  color: i === 0 ? "var(--color-bamboo-green)" : "var(--color-muted-gray)",
                  background: i === 0 ? "rgba(44,94,67,0.06)" : "transparent",
                  fontFamily: "var(--font-inter)",
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* A-Z Quick jump */}
        <div className="flex flex-wrap gap-1 mb-8">
          {"ABCDEFGHIKLMNOPQRSTUVXY".split("").map((c) => (
            <button
              key={c}
              className="w-8 h-8 rounded text-sm font-medium transition-colors hover:bg-[var(--color-lacquer-red)] hover:text-white"
              style={{
                fontFamily: "var(--font-inter)",
                color: "var(--color-muted-gray)",
                background: "var(--card-bg)",
                border: "1px solid var(--color-border-tan)",
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Author grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_AUTHORS.map((author) => (
            <AuthorCard key={author.id} author={author} />
          ))}
        </div>

        {/* Pagination stub */}
        <div className="flex justify-center items-center gap-2 mt-12">
          {[1, 2, 3, "...", 265].map((p, i) => (
            <button
              key={i}
              className="w-9 h-9 rounded-full text-sm transition-colors"
              style={{
                fontFamily: "var(--font-inter)",
                background: p === 1 ? "var(--color-lacquer-red)" : "transparent",
                color: p === 1 ? "#fff" : "var(--color-muted-gray)",
                border: p === 1 ? "none" : "1px solid var(--color-border-tan)",
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
