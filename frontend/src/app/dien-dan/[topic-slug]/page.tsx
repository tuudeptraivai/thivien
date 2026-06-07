import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import ReplyForm from "@/components/forum/ReplyForm";
import { getForumTopicDetail } from "@/lib/server-api";
import { formatDate } from "@/lib/utils";

interface Props {
  params: Promise<{ "topic-slug": string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { "topic-slug": slug } = await params;
  const topic = await getForumTopicDetail(slug);
  return { title: topic?.title ?? "Chủ đề diễn đàn" };
}

export default async function ForumTopicPage({ params }: Props) {
  const { "topic-slug": slug } = await params;
  const topic = await getForumTopicDetail(slug);
  if (!topic) notFound();

  return (
    <div style={{ background: "var(--color-background-parchment)", minHeight: "100vh" }}>
      <div className="max-w-[900px] mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <nav className="text-xs flex items-center gap-2 mb-6" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
          <Link href="/" className="hover:underline">Trang chủ</Link>
          <span>/</span>
          <Link href="/dien-dan" className="hover:underline">Diễn đàn</Link>
          <span>/</span>
          <span style={{ color: "var(--fg)" }}>{topic.title}</span>
        </nav>

        {/* Topic header */}
        <div className="mb-8">
          {topic.category && <Badge variant="muted" className="mb-3">{topic.category}</Badge>}
          <h1 className="text-headline-md mb-2" style={{ fontFamily: "var(--font-lora)", color: "var(--fg)" }}>
            {topic.title}
          </h1>
          <p className="text-xs" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
            Tạo bởi <strong style={{ color: "var(--fg)" }}>{topic.author_name}</strong>
            {" · "}{formatDate(topic.created_at)}
            {" · "}{topic.reply_count} trả lời
            {" · "}{topic.view_count} lượt xem
          </p>
        </div>

        {/* Posts */}
        <div className="space-y-4 mb-10">
          {topic.posts.map((post) => (
            <div
              key={post.id}
              className="card p-6"
              style={{
                background: post.is_op ? "var(--color-paper-pure)" : "var(--card-bg)",
                borderColor: post.is_op ? "var(--color-lacquer-red)" : "var(--color-border-tan)",
                borderLeftWidth: post.is_op ? 3 : 1,
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-white shrink-0"
                  style={{ background: post.is_op ? "var(--color-lacquer-red)" : "var(--color-bamboo-green)" }}
                >
                  {post.author_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ fontFamily: "var(--font-inter)", color: "var(--fg)" }}>
                    {post.author_name}
                    {post.is_op && (
                      <Badge variant="red" className="ml-2">Tác giả chủ đề</Badge>
                    )}
                  </p>
                  <p className="text-xs" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
                    {formatDate(post.created_at)}
                  </p>
                </div>
              </div>

              <p className="leading-relaxed whitespace-pre-line" style={{ fontFamily: "var(--font-inter)", color: "var(--fg)", fontSize: 15 }}>
                {post.content}
              </p>
            </div>
          ))}
        </div>

        {/* Reply form */}
        <ReplyForm topicId={topic.id} isLocked={topic.is_locked} />
      </div>
    </div>
  );
}
