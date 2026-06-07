import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { getForumTopics, getForumCategories } from "@/lib/server-api";
import { formatDate, formatNumber } from "@/lib/utils";

export const metadata: Metadata = { title: "Diễn đàn Văn học" };
export const revalidate = 30;

export default async function ForumPage() {
  const [{ data: topics }, categories] = await Promise.all([
    getForumTopics({ limit: 20 }),
    getForumCategories(),
  ]);

  return (
    <div style={{ background: "var(--color-background-parchment)", minHeight: "100vh" }}>
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <p className="text-label-caps mb-2" style={{ color: "var(--color-bamboo-green)" }}>
              CỘNG ĐỒNG
            </p>
            <h1 className="text-headline-lg" style={{ fontFamily: "var(--font-lora)", color: "var(--fg)" }}>
              Diễn đàn Văn học Việt
            </h1>
          </div>
          <Link href="/dien-dan/moi" className="btn-primary px-4 py-2 text-sm mt-2">
            + Tạo chủ đề mới
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
          {/* Left: categories */}
          <aside>
            <div className="card p-5">
              <h3 className="text-label-caps mb-4" style={{ color: "var(--color-bamboo-green)" }}>
                DANH MỤC
              </h3>
              {categories.length === 0 ? (
                <p className="text-sm" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
                  Chưa có danh mục.
                </p>
              ) : (
                <ul className="space-y-1">
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <span
                        className="w-full flex items-center px-3 py-2 rounded-md text-sm"
                        style={{ fontFamily: "var(--font-inter)", color: "var(--fg)" }}
                      >
                        {cat.name}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>

          {/* Right: topic list */}
          <section>
            {topics.length === 0 ? (
              <div className="text-center py-20 card" style={{ background: "var(--color-paper-pure)" }}>
                <p className="text-4xl mb-4">💬</p>
                <p className="text-lg font-medium mb-2" style={{ fontFamily: "var(--font-lora)", color: "var(--fg)" }}>
                  Chưa có chủ đề nào
                </p>
                <p className="text-sm mb-6" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
                  Hãy là người mở đầu cuộc thảo luận!
                </p>
                <Link href="/dien-dan/moi" className="btn-primary px-6 py-2.5 text-sm inline-block">
                  Tạo chủ đề mới
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {topics.map((topic) => (
                  <Link
                    key={topic.id}
                    href={`/dien-dan/${topic.slug}`}
                    className="card card-hover p-5 block"
                  >
                    <div className="flex items-start gap-3">
                      {topic.pinned && (
                        <span className="text-xs mt-1" title="Được ghim" style={{ color: "var(--color-lacquer-red)" }}>📌</span>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          {topic.category && <Badge variant="muted">{topic.category}</Badge>}
                          {topic.pinned && <Badge variant="red">Được ghim</Badge>}
                        </div>
                        <h3
                          className="text-base font-semibold mb-1 hover:text-[var(--color-lacquer-red)] transition-colors"
                          style={{ fontFamily: "var(--font-lora)", color: "var(--fg)" }}
                        >
                          {topic.title}
                        </h3>
                        <p className="text-xs" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
                          bởi <span style={{ color: "var(--fg)" }}>{topic.author_name}</span>
                          {" · "}
                          {formatDate(topic.created_at)}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold" style={{ fontFamily: "var(--font-inter)", color: "var(--fg)" }}>
                          {topic.reply_count}
                        </p>
                        <p className="text-xs" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
                          trả lời
                        </p>
                        <p className="text-xs mt-1" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
                          {formatNumber(topic.view_count)} lượt xem
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
