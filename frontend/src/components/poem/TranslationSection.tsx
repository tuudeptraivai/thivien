"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useStore } from "@/stores/useStore";
import { submitTranslation } from "@/lib/api";
import { Badge } from "@/components/ui/Badge";
import type { Translation } from "@/lib/types";

const TRANSLATION_TYPES = ["Thơ", "Văn xuôi", "Thơ tứ tuyệt", "Thơ lục bát", "Khác"];

interface Props {
  poemId: number;
  primaryVersionId: number | undefined;
  initialTranslations: Translation[];
}

export default function TranslationSection({ poemId, primaryVersionId, initialTranslations }: Props) {
  const user = useStore((s) => s.user);
  const [translations, setTranslations] = useState<Translation[]>(initialTranslations);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Form state
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Thơ");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();

  if (!primaryVersionId) return null;
  const versionId = primaryVersionId;

  function handleOpenForm() {
    if (!user) return;
    setShowForm(true);
    setError("");
    setSuccess("");
  }

  function handleCancel() {
    setShowForm(false);
    setContent("");
    setTitle("");
    setType("Thơ");
    setError("");
    setSuccess("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!content.trim()) { setError("Vui lòng nhập nội dung bản dịch."); return; }

    startTransition(async () => {
      try {
        const saved = await submitTranslation(poemId, versionId, {
          content: content.trim(),
          translation_title: title.trim() || undefined,
          translation_type: type,
        });

        const newTranslation: Translation = {
          id: saved.id ?? Date.now(),
          translator: user
            ? { id: user.id, name: user.display_name, slug: "" }
            : null as any,
          translation_title: title.trim() || undefined as any,
          content: content.trim(),
          translation_type: type,
          is_favorite: false,
        };

        setTranslations((prev) => [...prev, newTranslation]);
        setActiveTab(translations.length); // Switch to newly added tab
        setSuccess("Bản dịch của bạn đã được đóng góp!");
        setShowForm(false);
        setContent("");
        setTitle("");
        setType("Thơ");
      } catch (err: any) {
        const msg = err?.response?.data?.error?.message;
        setError(msg ?? "Gửi thất bại. Vui lòng thử lại.");
      }
    });
  }

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-label-caps" style={{ color: "var(--color-bamboo-green)" }}>
          BẢN DỊCH {translations.length > 0 && `(${translations.length})`}
        </h2>

        {user ? (
          <button
            onClick={showForm ? handleCancel : handleOpenForm}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all"
            style={{
              borderColor: showForm ? "var(--color-muted-gray)" : "var(--color-bamboo-green)",
              color: showForm ? "var(--color-muted-gray)" : "var(--color-bamboo-green)",
              fontFamily: "var(--font-inter)",
            }}
          >
            {showForm ? (
              "Hủy"
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Đóng góp bản dịch
              </>
            )}
          </button>
        ) : (
          <Link
            href="/dang-nhap"
            className="flex items-center gap-1 text-xs"
            style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Đăng nhập để đóng góp bản dịch
          </Link>
        )}
      </div>

      {/* Translation form */}
      {showForm && (
        <div
          className="card p-5 mb-4"
          style={{ background: "var(--color-paper-pure)", borderLeft: "3px solid var(--color-bamboo-green)" }}
        >
          <p className="text-xs font-semibold mb-4" style={{ color: "var(--color-bamboo-green)", fontFamily: "var(--font-inter)" }}>
            BẢN DỊCH CỦA {user?.display_name?.toUpperCase()}
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Tiêu đề bản dịch (tuỳ chọn)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-bamboo-green)] transition-colors"
                style={{
                  borderColor: "var(--color-border-tan)",
                  background: "var(--color-surface-container-lowest)",
                  fontFamily: "var(--font-inter)",
                  color: "var(--fg)",
                }}
              />
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-bamboo-green)] transition-colors"
                style={{
                  borderColor: "var(--color-border-tan)",
                  background: "var(--color-surface-container-lowest)",
                  fontFamily: "var(--font-inter)",
                  color: "var(--fg)",
                }}
              >
                {TRANSLATION_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <textarea
              rows={6}
              autoFocus
              placeholder="Nhập bản dịch của bạn..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border rounded-lg p-3 text-sm resize-none outline-none focus:border-[var(--color-bamboo-green)] transition-colors poem-content"
              style={{
                borderColor: "var(--color-border-tan)",
                background: "var(--color-surface-container-lowest)",
                fontFamily: "var(--font-lora)",
                color: "var(--fg)",
                lineHeight: 1.9,
              }}
            />

            {error && (
              <p className="text-xs" style={{ color: "var(--color-lacquer-red)", fontFamily: "var(--font-inter)" }}>
                {error}
              </p>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm rounded-lg border transition-colors"
                style={{ borderColor: "var(--color-border-tan)", color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="btn-primary px-4 py-2 text-sm disabled:opacity-60"
              >
                {isPending ? "Đang gửi..." : "Gửi bản dịch"}
              </button>
            </div>
          </form>
        </div>
      )}

      {success && !showForm && (
        <p
          className="text-xs mb-3 px-3 py-2 rounded-lg"
          style={{
            color: "var(--color-bamboo-green)",
            background: "color-mix(in srgb, var(--color-bamboo-green) 10%, transparent)",
            fontFamily: "var(--font-inter)",
          }}
        >
          ✓ {success}
        </p>
      )}

      {/* Translation list */}
      {translations.length === 0 && !showForm ? (
        <div
          className="card p-6 text-center"
          style={{ background: "var(--color-paper-pure)" }}
        >
          <p className="text-sm" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
            Chưa có bản dịch nào.{" "}
            {user ? (
              <button
                onClick={handleOpenForm}
                className="underline"
                style={{ color: "var(--color-bamboo-green)" }}
              >
                Hãy là người đầu tiên đóng góp!
              </button>
            ) : (
              <Link href="/dang-nhap" className="underline" style={{ color: "var(--color-bamboo-green)" }}>
                Đăng nhập để đóng góp!
              </Link>
            )}
          </p>
        </div>
      ) : translations.length > 0 ? (
        <div className="card" style={{ background: "var(--color-paper-pure)" }}>
          {/* Tab bar */}
          <div
            className="flex gap-0 overflow-x-auto border-b"
            style={{ borderColor: "var(--color-border-tan)" }}
          >
            {translations.map((t, i) => {
              const name = t.translator?.name ?? "Ẩn danh";
              const isActive = activeTab === i;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(i)}
                  className="px-4 py-2.5 text-xs font-medium whitespace-nowrap shrink-0 border-b-2 transition-colors"
                  style={{
                    borderBottomColor: isActive ? "var(--color-lacquer-red)" : "transparent",
                    color: isActive ? "var(--color-lacquer-red)" : "var(--color-muted-gray)",
                    fontFamily: "var(--font-inter)",
                    background: "transparent",
                  }}
                >
                  {name}
                  {t.is_favorite && (
                    <span className="ml-1" title="Bản dịch được chọn">★</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active translation content */}
          {translations[activeTab] && (
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {translations[activeTab].translator?.name && (
                  <span className="text-sm font-medium" style={{ fontFamily: "var(--font-inter)", color: "var(--fg)" }}>
                    Dịch giả:{" "}
                    {translations[activeTab].translator.slug ? (
                      <Link
                        href={`/tac-gia/${translations[activeTab].translator.slug}`}
                        className="hover:underline"
                        style={{ color: "var(--color-lacquer-red)" }}
                      >
                        {translations[activeTab].translator.name}
                      </Link>
                    ) : (
                      <span style={{ color: "var(--color-lacquer-red)" }}>
                        {translations[activeTab].translator.name}
                      </span>
                    )}
                  </span>
                )}
                {translations[activeTab].translation_type && (
                  <Badge variant="green">{translations[activeTab].translation_type}</Badge>
                )}
                {translations[activeTab].translation_title && (
                  <span className="text-xs italic" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-lora)" }}>
                    "{translations[activeTab].translation_title}"
                  </span>
                )}
                {translations[activeTab].is_favorite && (
                  <Badge variant="default">Bản được chọn</Badge>
                )}
              </div>

              <div>
                {translations[activeTab].content.split("\n").map((line, i) => (
                  <p key={i} className="poem-content" style={{ marginBottom: "0.25em" }}>
                    {line || " "}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}
