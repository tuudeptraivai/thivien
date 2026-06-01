"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/stores/useStore";
import { checkBookmark, toggleBookmark } from "@/lib/api";

interface Props {
  poemId: number;
}

export default function BookmarkButton({ poemId }: Props) {
  const user = useStore((s) => s.user);
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tooltip, setTooltip] = useState("");

  useEffect(() => {
    if (!user) return;
    checkBookmark(poemId)
      .then((b) => setBookmarked(b))
      .catch(() => {});
  }, [user, poemId]);

  async function handleClick() {
    if (!user) {
      setTooltip("Đăng nhập để lưu bài thơ");
      setTimeout(() => setTooltip(""), 2500);
      return;
    }

    setLoading(true);
    try {
      const result = await toggleBookmark(poemId);
      setBookmarked(result.bookmarked);
      setTooltip(result.message);
      setTimeout(() => setTooltip(""), 2000);
    } catch {
      setTooltip("Có lỗi xảy ra, thử lại sau.");
      setTimeout(() => setTooltip(""), 2000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={loading}
        aria-label={bookmarked ? "Bỏ lưu bài thơ" : "Lưu bài thơ"}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all disabled:opacity-60"
        style={{
          borderColor: bookmarked ? "var(--color-bamboo-green)" : "var(--color-border-tan)",
          color: bookmarked ? "var(--color-bamboo-green)" : "var(--color-muted-gray)",
          fontFamily: "var(--font-inter)",
          fontSize: 13,
        }}
      >
        <svg
          className="w-4 h-4"
          fill={bookmarked ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
        {bookmarked ? "Đã lưu" : "Lưu thơ"}
      </button>

      {tooltip && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap z-10 pointer-events-none"
          style={{
            background: "var(--fg)",
            color: "var(--color-background-parchment)",
            fontFamily: "var(--font-inter)",
          }}
        >
          {tooltip}
        </div>
      )}
    </div>
  );
}
