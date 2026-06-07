"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/stores/useStore";
import { createPoem, getAuthors } from "@/lib/api";
import type { Author } from "@/lib/types";

type AuthorMode = "self" | "existing" | "custom";

export default function TroLyPage() {
  const user = useStore((s) => s.user);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [authorMode, setAuthorMode] = useState<AuthorMode>("self");
  const [authors, setAuthors] = useState<Author[]>([]);
  const [selectedAuthorId, setSelectedAuthorId] = useState<string>("");
  const [customAuthorName, setCustomAuthorName] = useState("");

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    let active = true;
    getAuthors({ limit: 500 })
      .then((r) => active && setAuthors(r.data))
      .catch(() => active && setAuthors([]));
    return () => {
      active = false;
    };
  }, []);

  async function publish() {
    if (!user) {
      setFeedback({ type: "err", text: "Vui lòng đăng nhập để đăng bài." });
      return;
    }
    if (!title.trim()) {
      setFeedback({ type: "err", text: "Vui lòng nhập tên tác phẩm." });
      return;
    }
    if (!content.trim()) {
      setFeedback({ type: "err", text: "Vui lòng nhập nội dung bài thơ." });
      return;
    }

    const author: { author_id?: number; author_name?: string } = {};
    if (authorMode === "existing") {
      if (!selectedAuthorId) {
        setFeedback({ type: "err", text: "Vui lòng chọn một tác giả." });
        return;
      }
      author.author_id = Number(selectedAuthorId);
    } else if (authorMode === "custom") {
      if (!customAuthorName.trim()) {
        setFeedback({ type: "err", text: "Vui lòng nhập tên tác giả." });
        return;
      }
      author.author_name = customAuthorName.trim();
    }

    setSaving(true);
    setFeedback(null);
    try {
      const created = await createPoem({
        title: title.trim(),
        content: content.trim(),
        status: "published",
        ...author,
      });
      // "Chính tôi" → mục Thơ sáng tác; gắn tác giả → trang bài thơ trong thư viện.
      if (authorMode === "self") {
        router.push("/sang-tac");
      } else {
        router.push(`/tho/${created.slug}`);
      }
      router.refresh();
    } catch {
      setFeedback({ type: "err", text: "Có lỗi xảy ra, vui lòng thử lại." });
      setSaving(false);
    }
  }

  const SELECT_STYLE = {
    borderColor: "var(--color-border-tan)",
    background: "transparent",
    fontFamily: "var(--font-inter)",
    color: "var(--fg)",
  } as const;

  return (
    <div style={{ background: "#FAF9F6", minHeight: "100vh" }}>
      <div className="max-w-[760px] mx-auto px-4 py-10">
        <div className="mb-6">
          <p className="text-label-caps mb-2" style={{ color: "var(--color-bamboo-green)" }}>
            SÁNG TÁC
          </p>
          <h1 className="text-headline-md" style={{ fontFamily: "var(--font-lora)", color: "var(--fg)" }}>
            Viết bài mới
          </h1>
        </div>

        {!user && (
          <p className="text-sm mb-4" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
            <Link href="/dang-nhap" style={{ color: "var(--color-lacquer-red)" }}>Đăng nhập</Link>{" "}
            để đăng bài thơ lên cộng đồng.
          </p>
        )}

        <div className="card flex flex-col overflow-hidden" style={{ background: "#FFFFFF", border: "1.5px solid #D4C89A" }}>
          {/* Title + author */}
          <div className="p-6 border-b" style={{ borderColor: "var(--color-border-tan)" }}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tên tác phẩm..."
              className="w-full text-2xl outline-none bg-transparent font-semibold"
              style={{ fontFamily: "var(--font-lora)", color: "var(--fg)" }}
            />
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <label className="text-xs" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
                Tác giả:
              </label>
              <select
                value={authorMode}
                onChange={(e) => setAuthorMode(e.target.value as AuthorMode)}
                className="text-sm border rounded-md px-2 py-1 outline-none"
                style={SELECT_STYLE}
              >
                <option value="self">Chính tôi</option>
                <option value="existing">Tác giả có sẵn</option>
                <option value="custom">Tự điền tên tác giả</option>
              </select>

              {authorMode === "existing" && (
                <select
                  value={selectedAuthorId}
                  onChange={(e) => setSelectedAuthorId(e.target.value)}
                  className="text-sm border rounded-md px-2 py-1 outline-none flex-1 min-w-[180px]"
                  style={SELECT_STYLE}
                >
                  <option value="">— Chọn tác giả —</option>
                  {authors.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              )}

              {authorMode === "custom" && (
                <input
                  value={customAuthorName}
                  onChange={(e) => setCustomAuthorName(e.target.value)}
                  placeholder="Tên tác giả..."
                  className="text-sm border rounded-md px-2 py-1 outline-none flex-1 min-w-[180px]"
                  style={SELECT_STYLE}
                />
              )}
            </div>
          </div>

          {/* Poem body */}
          <div className="p-6">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập trọn bài thơ của bạn ở đây..."
              rows={12}
              className="w-full resize-y outline-none bg-transparent text-lg leading-relaxed"
              style={{ fontFamily: "var(--font-lora)", color: "var(--fg)", fontStyle: "italic" }}
            />
          </div>

          {/* Actions */}
          <div className="p-4 border-t" style={{ borderColor: "var(--color-border-tan)" }}>
            {feedback && (
              <p
                className="text-xs mb-2"
                style={{
                  color: feedback.type === "ok" ? "var(--color-bamboo-green)" : "var(--color-error)",
                  fontFamily: "var(--font-inter)",
                }}
              >
                {feedback.text}
              </p>
            )}
            <div className="flex justify-end">
              <button
                onClick={publish}
                disabled={saving}
                className="btn-primary px-5 py-2 text-sm disabled:opacity-60"
                style={{ background: "var(--color-bamboo-green)" }}
              >
                🌐 {saving ? "Đang đăng..." : "Đăng lên cộng đồng"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
