"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useStore } from "@/stores/useStore";
import { getMyBookmarks, type BookmarkItem } from "@/lib/api";

export default function CaNhanPage() {
  const user = useStore((s) => s.user);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) return;
    let active = true;
    getMyBookmarks()
      .then((d) => active && setBookmarks(d))
      .catch(() => active && setBookmarks([]))
      .finally(() => active && setLoaded(true));
    return () => {
      active = false;
    };
  }, [user]);

  return (
    <div style={{ background: "var(--color-background-parchment)", minHeight: "100vh" }}>
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-label-caps mb-2" style={{ color: "var(--color-bamboo-green)" }}>
              CÁ NHÂN
            </p>
            <h1 className="text-headline-lg" style={{ fontFamily: "var(--font-lora)", color: "var(--fg)" }}>
              {user ? `Tủ thơ của ${user.display_name}` : "Tủ thơ yêu thích"}
            </h1>
          </div>
          {!user && (
            <Link href="/dang-nhap" className="btn-primary px-4 py-2 text-sm mt-2">
              Đăng nhập để lưu thơ
            </Link>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b mb-6" style={{ borderColor: "var(--color-border-tan)" }}>
          {["Tủ sách", "Cài đặt đọc"].map((t, i) => (
            <span
              key={t}
              className="px-4 py-2.5 text-sm font-medium"
              style={{
                fontFamily: "var(--font-inter)",
                color: i === 0 ? "var(--color-lacquer-red)" : "var(--color-muted-gray)",
                borderBottom: i === 0 ? "2px solid var(--color-lacquer-red)" : "2px solid transparent",
                cursor: "pointer",
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {!user ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">📚</p>
            <p className="text-lg font-medium mb-2" style={{ fontFamily: "var(--font-lora)", color: "var(--fg)" }}>
              Đăng nhập để xem tủ thơ của bạn
            </p>
            <p className="text-sm mb-6" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
              Lưu lại những bài thơ yêu thích để đọc lại bất cứ lúc nào.
            </p>
            <Link href="/dang-nhap" className="btn-primary px-6 py-2.5 text-sm inline-block">
              Đăng nhập
            </Link>
          </div>
        ) : !loaded ? (
          <p className="text-sm py-10 text-center" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
            Đang tải tủ sách...
          </p>
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">📖</p>
            <p className="text-lg font-medium mb-2" style={{ fontFamily: "var(--font-lora)", color: "var(--fg)" }}>
              Tủ sách còn trống
            </p>
            <p className="text-sm mb-6" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
              Hãy lưu những bài thơ bạn yêu thích khi đọc.
            </p>
            <Link href="/tho" className="btn-primary px-6 py-2.5 text-sm inline-block">
              Khám phá thơ
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookmarks.map((b) => (
              <Link key={b.poem_id} href={`/tho/${b.slug}`} className="block">
                <article className="card card-hover p-5 h-full">
                  <h3
                    className="poem-card-title text-base mb-1 line-clamp-2"
                    style={{ fontFamily: "var(--font-lora)", fontWeight: 600 }}
                  >
                    {b.title}
                  </h3>
                  <p className="text-sm" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
                    <span style={{ color: "var(--color-lacquer-red)" }}>
                      {b.author?.name ?? "Khuyết danh"}
                    </span>
                  </p>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
