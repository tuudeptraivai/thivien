"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/stores/useStore";
import { checkLiked, likePoem } from "@/lib/api";

interface Props {
  poemId: number;
  initialLikeCount: number;
}

export default function LikeButton({ poemId, initialLikeCount }: Props) {
  const user = useStore((s) => s.user);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [loading, setLoading] = useState(false);
  const [tooltip, setTooltip] = useState("");
  const [burst, setBurst] = useState(false);

  useEffect(() => {
    if (!user) return;
    checkLiked(poemId)
      .then((v) => setLiked(v))
      .catch(() => {});
  }, [user, poemId]);

  async function handleClick() {
    if (!user) {
      setTooltip("Đăng nhập để yêu thích bài thơ");
      setTimeout(() => setTooltip(""), 2500);
      return;
    }

    setLoading(true);
    try {
      const result = await likePoem(poemId);
      setLiked(result.liked);
      setLikeCount(result.like_count);
      if (result.liked) {
        setBurst(true);
        setTimeout(() => setBurst(false), 400);
      }
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
        aria-label={liked ? "Bỏ yêu thích" : "Yêu thích bài thơ"}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all disabled:opacity-60 select-none"
        style={{
          borderColor: liked ? "var(--color-lacquer-red)" : "var(--color-border-tan)",
          color: liked ? "var(--color-lacquer-red)" : "var(--color-muted-gray)",
          fontFamily: "var(--font-inter)",
          fontSize: 13,
        }}
      >
        <svg
          className="w-4 h-4 transition-transform"
          style={{
            transform: burst ? "scale(1.35)" : "scale(1)",
            transition: "transform 0.2s cubic-bezier(.36,1.6,.48,1)",
          }}
          fill={liked ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
          />
        </svg>
        <span>{likeCount > 0 ? likeCount.toLocaleString() : "Yêu thích"}</span>
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
