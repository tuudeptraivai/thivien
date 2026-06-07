"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/stores/useStore";
import { createForumPost } from "@/lib/api";

interface Props {
  topicId: number;
  isLocked?: boolean;
}

export default function ReplyForm({ topicId, isLocked }: Props) {
  const user = useStore((s) => s.user);
  const router = useRouter();
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  if (isLocked) {
    return (
      <div className="card p-6 text-center" style={{ background: "var(--color-paper-pure)" }}>
        <p className="text-sm" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
          🔒 Chủ đề này đã bị khóa, không thể trả lời.
        </p>
      </div>
    );
  }

  function submit() {
    setError("");
    if (!user) {
      setError("Vui lòng đăng nhập để trả lời.");
      return;
    }
    if (!content.trim()) {
      setError("Vui lòng nhập nội dung trả lời.");
      return;
    }
    startTransition(async () => {
      try {
        await createForumPost(topicId, content.trim());
        setContent("");
        router.refresh();
      } catch {
        setError("Gửi trả lời thất bại, vui lòng thử lại.");
      }
    });
  }

  return (
    <div className="card p-6" style={{ background: "var(--color-paper-pure)" }}>
      <h3 className="text-label-caps mb-4" style={{ color: "var(--color-bamboo-green)" }}>
        VIẾT TRẢ LỜI
      </h3>
      <textarea
        rows={5}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Chia sẻ quan điểm của bạn về chủ đề này..."
        className="w-full border rounded-lg p-4 text-sm resize-none outline-none focus:border-[var(--color-lacquer-red)] transition-colors mb-3"
        style={{
          borderColor: "var(--color-border-tan)",
          background: "var(--color-surface-container-lowest)",
          fontFamily: "var(--font-inter)",
          color: "var(--fg)",
        }}
      />
      {error && (
        <p className="text-xs mb-3" style={{ color: "var(--color-error)", fontFamily: "var(--font-inter)" }}>
          {error}
        </p>
      )}
      <div className="flex justify-between items-center">
        {!user ? (
          <p className="text-xs" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
            Vui lòng <Link href="/dang-nhap" className="underline" style={{ color: "var(--color-lacquer-red)" }}>đăng nhập</Link> để bình luận
          </p>
        ) : (
          <span />
        )}
        <button
          onClick={submit}
          disabled={isPending}
          className="btn-primary px-5 py-2 text-sm disabled:opacity-60"
        >
          {isPending ? "Đang gửi..." : "Gửi trả lời"}
        </button>
      </div>
    </div>
  );
}
