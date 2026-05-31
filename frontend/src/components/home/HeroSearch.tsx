"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HeroSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) {
      router.push(`/search?q=${encodeURIComponent(q.trim())}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex justify-center">
      <div
        className="search-pill flex items-center gap-3 px-5 py-3.5 w-full max-w-[640px]"
      >
        <svg
          className="w-5 h-5 shrink-0"
          style={{ color: "var(--color-lacquer-red)" }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
          />
        </svg>
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm bài thơ, tác giả, câu thơ chữ Hán..."
          className="flex-1 bg-transparent outline-none text-base"
          style={{
            fontFamily: "var(--font-inter)",
            color: "var(--fg)",
          }}
        />
        <kbd
          className="hidden sm:flex items-center gap-1 text-xs px-2 py-1 rounded border shrink-0"
          style={{
            color: "var(--color-muted-gray)",
            borderColor: "var(--color-border-tan)",
            fontFamily: "var(--font-inter)",
          }}
        >
          ⌘K
        </kbd>
      </div>
    </form>
  );
}
