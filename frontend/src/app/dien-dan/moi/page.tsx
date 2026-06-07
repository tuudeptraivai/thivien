"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/stores/useStore";
import { getForumCategories, createForumTopic } from "@/lib/api";
import type { ForumCategoryItem } from "@/lib/types";

const INPUT_STYLE = {
  borderColor: "var(--color-border-tan)",
  background: "var(--color-surface-container-lowest)",
  fontFamily: "var(--font-inter)",
  color: "var(--fg)",
} as const;

export default function NewTopicPage() {
  const user = useStore((s) => s.user);
  const router = useRouter();

  const [categories, setCategories] = useState<ForumCategoryItem[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getForumCategories()
      .then((c) => active && setCategories(c))
      .catch(() => active && setCategories([]));
    return () => {
      active = false;
    };
  }, []);

  async function submit() {
    setError("");
    if (!user) {
      setError("Vui lòng đăng nhập để tạo chủ đề.");
      return;
    }
    if (!categoryId) {
      setError("Vui lòng chọn chuyên mục.");
      return;
    }
    if (!title.trim()) {
      setError("Vui lòng nhập tiêu đề chủ đề.");
      return;
    }
    if (!content.trim()) {
      setError("Vui lòng nhập nội dung.");
      return;
    }

    setSaving(true);
    try {
      const { slug } = await createForumTopic({
        category_id: Number(categoryId),
        title: title.trim(),
        content: content.trim(),
      });
      router.push(`/dien-dan/${slug}`);
      router.refresh();
    } catch {
      setError("Tạo chủ đề thất bại, vui lòng thử lại.");
      setSaving(false);
    }
  }

  return (
    <div style={{ background: "var(--color-background-parchment)", minHeight: "100vh" }}>
      <div className="max-w-[760px] mx-auto px-6 py-10">
        <nav className="text-xs flex items-center gap-2 mb-6" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
          <Link href="/dien-dan" className="hover:underline">Diễn đàn</Link>
          <span>/</span>
          <span style={{ color: "var(--fg)" }}>Tạo chủ đề mới</span>
        </nav>

        <h1 className="text-headline-md mb-6" style={{ fontFamily: "var(--font-lora)", color: "var(--fg)" }}>
          Tạo chủ đề mới
        </h1>

        {!user && (
          <p className="text-sm mb-4" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
            <Link href="/dang-nhap" style={{ color: "var(--color-lacquer-red)" }}>Đăng nhập</Link>{" "}
            để tạo chủ đề thảo luận.
          </p>
        )}

        <div className="card p-6 space-y-4" style={{ background: "var(--color-paper-pure)" }}>
          <div>
            <label className="text-label-caps block mb-2" style={{ color: "var(--color-bamboo-green)" }}>
              CHUYÊN MỤC
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none"
              style={INPUT_STYLE}
            >
              <option value="">— Chọn chuyên mục —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-label-caps block mb-2" style={{ color: "var(--color-bamboo-green)" }}>
              TIÊU ĐỀ
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tiêu đề chủ đề..."
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-lacquer-red)] transition-colors"
              style={INPUT_STYLE}
            />
          </div>

          <div>
            <label className="text-label-caps block mb-2" style={{ color: "var(--color-bamboo-green)" }}>
              NỘI DUNG
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Chia sẻ nội dung, câu hỏi hoặc quan điểm của bạn..."
              rows={8}
              className="w-full border rounded-lg p-3 text-sm resize-y outline-none focus:border-[var(--color-lacquer-red)] transition-colors"
              style={INPUT_STYLE}
            />
          </div>

          {error && (
            <p className="text-xs" style={{ color: "var(--color-error)", fontFamily: "var(--font-inter)" }}>
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <Link
              href="/dien-dan"
              className="btn-ghost px-4 py-2 text-sm"
              style={{ color: "var(--color-muted-gray)" }}
            >
              Hủy
            </Link>
            <button
              onClick={submit}
              disabled={saving}
              className="btn-primary px-5 py-2 text-sm disabled:opacity-60"
            >
              {saving ? "Đang tạo..." : "Tạo chủ đề"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
